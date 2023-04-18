const express = require('express')
const router = express.Router()
const { getServices, getService, getUnavailableTimes, getBusinesses, search, getBusiness, updateBusiness } = require('../controllers/business')
const { createAppointment } = require('../controllers/appointment')
const { auth, authoRize} = require('../middleware/authentication')

router.get('/:id/services', getServices)
router.get('/:id/services/:serviceId', getService)
router.get('/:id/services/:serviceId/unavailable/:year-:month-:day', getUnavailableTimes)
router.get('/all', getBusinesses)
router.post('/:id/book', auth, authoRize('user'), createAppointment)
router.get('/search/:term', search)
router.get('/:id', getBusiness)
router.patch('/:id/edit', auth, authoRize('shop-owner'), updateBusiness)

module.exports = router
