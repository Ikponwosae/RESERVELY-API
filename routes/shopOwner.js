const express = require('express')
const router = express.Router()

const { getDashboard, addService, updateService, deleteService, getWaitList } = require('../controllers/shopOwner')
const { inviteStaff } = require('../controllers/auth')
const { auth, authoRize} = require('../middleware/authentication')

router.route('/dashboard').get(getDashboard)
router.route('/invite').post(inviteStaff)
// router.route('/add-service', serviceAdd).post(addService)
router.post('/add-service', addService)
router.route('/service/:id').patch(updateService).delete(deleteService)
router.get('/waitlist', auth, authoRize('shop-owner'), getWaitList)

module.exports = router