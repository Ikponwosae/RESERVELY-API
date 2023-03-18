const { Appointment, Business, Service, User } = require('../models/index')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors/index')
const { createAppointmentEmail } = require('../email')

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
// @route POST /api/v1/owner/appointment/:id/approve
// @access Shop Owner
const assignAndApprove = async (req, res) => {
    const { params: {id: appointmentId } } = req
    const { staffId } = req.body   
}

module.exports = {
    createAppointment,
}