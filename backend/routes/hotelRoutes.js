const express = require('express')
const router = express.Router()
const {
    register, login, dashboard, addGuest, delGuest, guestList, guestHistory, changePass, stationsList, forgetPass, validateToken
} = require('../controllers/hotelController')
const {protect} = require('../middleware/authMiddleware')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/forgetpass').post(forgetPass)
router.route('/validate').post(validateToken)
router.route('/stations').get(stationsList)
router.get('/dashboard', protect, dashboard)
router.get('/guests', protect, guestList)
router.get('/history', protect, guestHistory)
router.post('/guest', protect, addGuest)
router.delete('/guest', protect, delGuest)
router.post('/changepass', protect, changePass)

module.exports = router