const express = require('express')
const router = express.Router()
const { createAppointment, assignAndApprove } = require('../controllers/appointment')
const {auth, authoRize} = require('../middleware/authentication')


// router.post('/:id/book', createAppointment)
router.put('/:id/approve', auth, authoRize('shop-owner'), assignAndApprove)

module.exports = router
