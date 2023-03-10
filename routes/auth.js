const express = require('express')
const router = express.Router()
const { userRegister} = require('../validations/user.validator')


const {login,registerUser, registerBusiness, completeRegistration, staffRegister} =  require('../controllers/auth')

router.post('/register', registerUser)
router.get('/verification/:token', completeRegistration)
router.post('/register/business/:userId', registerBusiness)
router.post('/staff-verify/:token', staffRegister)
router.post('/login', login)


module.exports = router