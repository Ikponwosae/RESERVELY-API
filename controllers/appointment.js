const { Appointment, Business, Service, User } = require('../models/index')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors/index')
const { 
    createAppointmentEmail,
    approvedAppointmentUserEmail,
    scheduleAppointmentStaffEmail
} = require('../email')

// @desc BOOK an appointment under a business
// @route POST /api/v1/business/:id/book
// @access User
const createAppointment = async (req, res) => {
    const user = req.user.userId
    if(!user) throw new UnauthenticatedError('You have to be logged in to create an appointment')
    const userExists = await User.findById({_id: req.user.userId})

    let { start, bookDate, serviceId } = req.body
    
    const { params: {id: business } } = req
    const businessExists = await Business.findOne({_id: business}) 
    if (!businessExists) throw new NotFoundError('A business with that id cannot be found')

    const service = await Service.findById({_id: serviceId})

    const defaultDate = new Date(bookDate);
    defaultDate.setHours(0,0,0,0)
    bookDate = defaultDate

    const startTime = new Date(start)
    startTime.setSeconds(0)

    const endTime = new Date(start)
    endTime.setMinutes(startTime.getMinutes() + service.duration)
    endTime.setSeconds(0)

    const appointment =  await Appointment.create({
        startTime, endTime, bookDate, service, business, users: user
    })

    //send appointment email
    await createAppointmentEmail(userExists.email, userExists.firstName + ' ' + userExists.lastName, businessExists.name, service.name)

    res.status(StatusCodes.CREATED).json({appointment})
}

// @desc approve an appointment and assign to staff
// @route POST /api/v1/appointment/:id/approve
// @access Shop Owner
const assignAndApprove = async (req, res) => {
    let { staffId, bookDate, startTime, endTime } = req.body
    const appointmentId = req.params.id

    const staffExists = await User.findOne({_id: staffId, role: 'staff'})
    if (!staffExists) throw new NotFoundError('A staff with that id cannot be found')

    const defaultDate = new Date(bookDate);
    defaultDate.setHours(0,0,0,0)
    bookDate = defaultDate

    startTime = new Date(startTime)
    startTime.setSeconds(0)

    endTime = new Date(endTime)
    endTime.setSeconds(0)

    //add staff to the appointment and change status to approved
    const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        { 
            $addToSet: { users: staffId },
            $set: { bookDate: bookDate, status: 'approved', startTime: startTime, endTime: endTime }
         },
        { new: true }
      ).populate("users", "firstName lastName email role")
      .populate("business", "name")
      .populate("service", "name");

    const isoDate = bookDate.toISOString();
    const day = isoDate.slice(0, 10);

    const formattedStartTime = getTime(startTime)
    const formattedEndTime = getTime(endTime)
      
    const userExists = appointment.users.filter(filterCustomers);

    //send mail to staff and customer
    await approvedAppointmentUserEmail(
        userExists[0].email, 
        userExists[0].firstName + ' ' + userExists[0].lastName,
        staffExists.firstName + ' ' + staffExists.lastName,
        day,
        formattedStartTime + ' till ' + formattedEndTime,
        appointment.business.name, 
        appointment.service.name)

    await scheduleAppointmentStaffEmail(
        staffExists.email, 
        staffExists.firstName + ' ' + staffExists.lastName,
        userExists[0].firstName + ' ' + userExists[0].lastName,
        day,
        formattedStartTime + ' till ' + formattedEndTime)

    res.status(StatusCodes.OK).json({ success: true, appointment})
}

const filterCustomers = user => user.role === "user";

const getTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const amPm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for AM and noon/midnight to 12 for PM
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes; // Add leading zero for single digit minutes
    const formattedTime = `${formattedHours}:${formattedMinutes} ${amPm}`;

    return formattedTime
}

module.exports = {
    createAppointment,
    assignAndApprove
}