const express = require('express')
const router = express.Router()

const {login,registerUser, registerBusiness, completeRegistration, staffRegister, getUser, updateUser} =  require('../controllers/auth')
const { auth, authoRize} = require('../middleware/authentication')

router.post('/register', registerUser)
router.get('/verification/:token', completeRegistration)
router.post('/register/business/:userId', registerBusiness)
router.post('/staff-verify/:token', staffRegister)
router.post('/login', login)
router.get('/user/:id', getUser)
router.get('/user/:id/edit', auth, authoRize('user'), updateUser)

module.exports = router