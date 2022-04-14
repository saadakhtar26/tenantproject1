const express = require('express')
const router = express.Router()
const {
    login, dashboard, newTenants, verifyTenant, tenantList, tenantHistory, newHotels, hotelsList, hotelGuestsList, hotelGuestsHistory
} = require('../controllers/policeController')
const {protect} = require('../middleware/authMiddleware')

router.route('/login').post(login)
router.get('/dashboard', protect, dashboard)
router.get('/newTenants', protect, newTenants)
router.post('/verifyTenant', protect, verifyTenant)
router.get('/tenantsList', protect, tenantList)
router.get('/tenantsHistory', protect, tenantHistory)
router.get('/newHotels', protect, newHotels)
router.get('/hotelsList', protect, hotelsList)
router.get('/hotelGuestsList', protect, hotelGuestsList)
router.get('/hotelGuestsHistory', protect, hotelGuestsHistory)

module.exports = router