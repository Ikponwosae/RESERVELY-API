const express = require('express')
const router = express.Router()
const { getServices, getService } = require('../controllers/business')
const { createAppointment } = require('../controllers/appointment')
const { auth, authoRize} = require('../middleware/authentication')


router.get('/:id/services', getServices)
router.get('/:id/services/:serviceId', getService)
router.post('/:id/book', auth, authoRize('user'), createAppointment)

module.exports = router
