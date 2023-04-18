const { User, Business, Service, Appointment } =  require('../models/index')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } =  require('../errors/index')
const { validationResult } = require('express-validator')


// @desc shop owner dashboard
// @route POST /api/v1/owner/dashboard
// @access Shop Owner
const getDashboard = async (req, res) => {
    const user = req.user.userId
    const business = await Business.findOne({owner: user})

    const staff = await User.find({business: business._id}).sort('createdAt')

    res.status(StatusCodes.OK).json({staff, count: staff.length})
}

// @desc Register a service under a business
// @route POST /api/v1/owner/add-service
// @access Shop Owner
const addService = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, errors: errors.array() });
    }

    const owner = await User.findOne({_id: req.user.userId})

    if (await Service.find({name: req.body.name, business: owner.business}) != 0) {
        throw new BadRequestError('A service with that name exists for this business')
    }else {
        try {
            req.body.createdBy = owner._id
            req.body.business = owner.business
            const service = await Service.create(req.body)
            res.status(StatusCodes.CREATED).json({success: true, service: service})
    }   catch (error) {
            throw new BadRequestError('Cannot add Service')
        }
    }    
}

// @desc update a service under a business
// @route PATCH /api/v1/owner/service/:id
// @access Shop Owner
const updateService = async(req, res) => {
    const owner = await User.findById({_id: req.user.userId})
    const { params:{id: serviceId}} = req
    const service = await Service.findOne({_id: serviceId})
    if(!service) {
        throw new NotFoundError('Service cannot be found')
    } else if(String(service.business) !== String(owner.business)) {
        throw new UnauthenticatedError('You are not authorized to edit this item')
    }

    const updates = req.body
    await Service.updateOne({_id: serviceId}, {$set: updates})

    res.status(StatusCodes.OK).json({ success: true, service})
}

// @desc delete a service under a business
// @route DELETE /api/v1/owner/service/:id
// @access Shop Owner
const deleteService = async(req, res) => {
    const { params: {id: serviceId} } = req
    const owner = req.user.userId
    const service = await Service.findByIdAndRemove({_id: serviceId, createdBy: owner})
    if(!service) {
        throw new NotFoundError('Service cannot be found')
    }

    res.status(StatusCodes.OK).send()
}

const getWaitList = async (req, res) => {
    const user = req.user.userId
    if(!user) throw new UnauthenticatedError('You have to be logged in to see waitlist')

    const owner = await User.findById({_id: user})

    const waitlist = await Appointment.find({ 
        business: owner.business 
    })
    .where({ status: 'waiting' })
    .sort('createdAt')

    res.status(StatusCodes.OK).json({ success: true, waitlist, count: waitlist.length})
}

// @desc list of available staffs for a particular day and time range
// @route GET /api/v1/owner/staff/available/YYYY-MM-DD?startTime=&endTime=
// @access All
const getAvailableStaffs = async (req, res) => {
    const user = req.user.userId
    if(!user) throw new UnauthenticatedError('You have to be logged in to see waitlist')
    const owner = await User.findById({_id: user})

    const day = new Date(`${req.params.year}-${req.params.month}-${req.params.day}`);
    day.setHours(0,0,0,0)

    const formatStartTime = req.query.startTime.split(':')
    const startHour = formatStartTime[0]
    const startMinutes = formatStartTime[1]

    const formatEndTime = req.query.endTime.split(':')
    const endHour = formatEndTime[0]
    const endMinutes = formatEndTime[1]

    const startRange = new Date(`${req.params.year}-${req.params.month}-${req.params.day} ${startHour}:${startMinutes}`);
    startRange.setSeconds(0)

    const endRange =  new Date(`${req.params.year}-${req.params.month}-${req.params.day} ${endHour}:${endMinutes}`);
    endRange.setSeconds(0)

    const availableStaff = await User.find({
        role: "staff",
        business: owner.business,
        _id: {
            $nin: await Appointment.distinct("users", {
                bookDate: day,
                $or: [
                    { $and: [{ startTime: { $lte: startRange } }, { endTime: { $gte: startRange } }] },
                    { $and: [{ startTime: { $lte: endRange } }, { endTime: { $gte: endRange } }] },
                    { $and: [{ startTime: { $gte: startRange } }, { endTime: { $lte: endRange } }] }
                  ]
            })
        }
    });

    res.status(StatusCodes.OK).json({ success: true, availableStaff, count: availableStaff.length})
}

const getStats = async (req, res) => {
    const user = req.user.userId
    if(!user) throw new UnauthenticatedError('You have to be logged in to see waitlist')

    const owner = await User.findById({_id: user})

    const waiting = await Appointment.find({ 
        business: owner.business 
    })
    .where({ status: 'waiting' })

    const approved = await Appointment.find({ 
        business: owner.business 
    })
    .where({ status: 'approved' })

    const closed = await Appointment.find({ 
        business: owner.business 
    })
    .where({ status: 'closed' })

    res.status(StatusCodes.OK).json({ success: true, count: [
        {
            id: 1,
            name: "waiting",
            value: waiting.length
        },
        {
            id: 2,
            name: "approved",
            value: approved.length
        },
        {
            id: 3,
            name: "closed",
            value: closed.length
        }
    ]})
}

const getAppointments = async(req, res) =>{
    const user = req.user.userId
    if(!user) throw new UnauthenticatedError('You have to be logged in to see appointments')

    const appointments = await Appointment.find({ 
        business: user.business 
    });

    res.status(StatusCodes.OK).json({ success: true, appointments, count: appointments.length})
}

module.exports = {
    getDashboard,
    addService,
    updateService,
    deleteService,
    getWaitList,
    getAvailableStaffs,
    getStats,
    getAppointments,
}