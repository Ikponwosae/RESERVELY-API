const { Appointment, Business, Service } = require('../models/index')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors/index')

// @desc BOOK an appointment under a business
// @route POST /api/v1/business/:id/book
// @access User
const createAppointment = async (req, res) => {
    const user = req.user.userId
    if(!user) throw new UnauthenticatedError('You have to be logged in to create an appointment')

    const { start, serviceId } = req.body
    
    const { params: {id: business } } = req
    if(!await Business.findOne({_id: business})) throw new NotFoundError('A business with that id cannot be found')

    const service = await Service.findById({_id: serviceId})

    const startTime = new Date(start)

    const endTime = new Date(start)
    endTime.setMinutes(startTime.getMinutes() + service.duration)

    const appointment =  await Appointment.create({
        startTime, endTime, service, business, users: user
    })
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