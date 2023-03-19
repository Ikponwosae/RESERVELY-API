const express = require('express')
const router = express.Router()

const { 
    getDashboard, 
    addService, 
    updateService, 
    deleteService, 
    getWaitList,
    getAvailableStaffs
} = require('../controllers/shopOwner')
const { inviteStaff } = require('../controllers/auth')

router.route('/dashboard').get(getDashboard)
router.route('/invite').post(inviteStaff)
// router.route('/add-service', serviceAdd).post(addService)
router.post('/add-service', addService)
router.route('/service/:id').patch(updateService).delete(deleteService)
router.get('/waitlist', getWaitList)
router.get('/staff/available/:year-:month-:day', getAvailableStaffs)

module.exports = router