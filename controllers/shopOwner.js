const { User, Business, Service } =  require('../models/index')
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

// @desc update a services under a business
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


module.exports = {
    getDashboard,
    addService,
    updateService,
    deleteService,
}