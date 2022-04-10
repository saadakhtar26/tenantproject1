const express = require('express')
const router = express.Router()
const {
    dashboard, addGuest, delGuest, guestList, guestHistory
} = require('../controllers/hotelController')

router.route('/dashboard').get(dashboard)
router.route('/guestList').get(guestList)
router.route('/guestHistory').get(guestHistory)
router.route('/addGuest').post(addGuest)
router.route('/delGuest').delete(delGuest)

module.exports = router