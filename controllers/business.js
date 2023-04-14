const { Appointment, Business, Service } =  require('../models/index')
const {StatusCodes} = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } =  require('../errors/index')

// @desc list of services under a business
// @route GET /api/v1/business/:id/services
// @access All
const getServices = async(req, res) => {
    const { params:{id: bizId} } = req
    if(!await Business.findOne({_id: bizId})){
        throw new NotFoundError('A business with that id cannot be found')
    }
    const services =  await Service.find({business: bizId}).sort('createdAt')
    res.status(StatusCodes.OK).json({services, count: services.length})
}

// @desc Single service under a business
// @route GET /api/v1/business/:id/services/:serviceId
// @access All
const getService = async (req, res) => {
    const { params: {id: bizId, serviceId: id} } = req
    if(!await Business.findOne({_id: bizId}) || !await Service.findOne({_id: id})) {
        throw new NotFoundError('Resource cannot be found')
    }
    const service = await Service.findOne({_id: id, business: bizId})
    res.status(StatusCodes.OK).json({service})
}

const unavailableTimes = async(id, date=new Date()) => {
    const dateToFind = new Date(date)
    dateToFind.setHours(0,0,0,0)

    const times = await Appointment.find({ 
        service: id
    })
    .where({
        $and: [ {
            $or: [ { status: 'ongoing' },  { status: 'waiting' }, { status: 'approved'} ]
        }, 
        { bookDate : dateToFind } ]
    })
    .sort('createdAt')

    return times
}

// @desc list of unavailable times under a service
// @route GET /api/v1/business/:id/services/:serviceId/unavailable
// @access All
const getUnavailableTimes = async (req, res) => {
    const serviceId = req.params.serviceId
    const date = new Date(`${req.params.year}-${req.params.month}-${req.params.day}`)
    const times = await unavailableTimes(serviceId, date)

    res.status(StatusCodes.OK).json({ success: true, times, count: times.length })
}

// @desc list of businesses
// @route GET /api/v1/business/all
// @access All
const getBusinesses = async (req, res) => {
    const businesses = await Business.find().sort('createdAt').limit(10)

    res.status(StatusCodes.OK).json({businesses: businesses, count: businesses.length})
}
function escapeRegex(string) {
    return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
}

// @desc list of businesses
// @route POST /api/v1/business/search
// @access All
const search = async (req, res) => {
    const { search } = req.body

    let businesses
    try {
      const regex = new RegExp(escapeRegex(search), "gi");
      businesses =  await Business.find({
        $or: [{ name: regex }, { country: regex }],
      });
    } catch (error) {
      console.log(error);
    }
    res.status(StatusCodes.OK).json({businesses})
}


module.exports = {
    getServices,
    getService,
    getUnavailableTimes,
    getBusinesses,
    search,
}