const express = require('express')
const router = express.Router()
const {
    register, login, dashboard, addGuest, delGuest, guestList, guestHistory
} = require('../controllers/hotelController')
const {protect} = require('../middleware/authMiddleware')

router.route('/register').post(register)
router.route('/login').post(login)
router.get('/dashboard', protect, dashboard)
router.get('/guestList', protect, guestList)
router.get('/guestHistory', protect, guestHistory)
router.post('/addGuest', protect, addGuest)
router.delete('/delGuest', protect, delGuest)

module.exports = router