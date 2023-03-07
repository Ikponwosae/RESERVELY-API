const express = require('express')
const router = express.Router()

const { staffRegister } = require('../controllers/auth')

// router.route('/verify').post(staffRegister)

module.exports = router