const express = require('express')
const router = express.Router()
const {
    /*register, login,*/ dashboard, addGuest, delGuest, guestList, guestHistory
} = require('../controllers/hotelController')

//router.route('/register').post(register)
//router.route('/login').post(login)
router.route('/dashboard').get(dashboard)
router.route('/guestList').get(guestList)
router.route('/guestHistory').get(guestHistory)
router.route('/addGuest').post(addGuest)
router.route('/delGuest').delete(delGuest)

module.exports = router