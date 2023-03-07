const express = require('express')
const router = express.Router()
const { getShops } = require('../controllers/admin')


router.route('/dashboard').get(getShops)

module.exports = router