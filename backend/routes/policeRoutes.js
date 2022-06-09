const express = require('express')
const router = express.Router()
const {
    login, dashboard, newTenants, verifyTenant, verifyHotel, tenantList, tenantHistory, newHotels, hotelsList, hotelGuestsList, hotelGuestsHistory, changePass
} = require('../controllers/policeController')
const {protect} = require('../middleware/authMiddleware')

router.route('/login').post(login)
router.get('/dashboard', protect, dashboard)
router.get('/tenants', protect, tenantList)
router.get('/tenants/new', protect, newTenants)
router.post('/tenants/verify', protect, verifyTenant)
router.get('/tenants/history', protect, tenantHistory)
router.get('/hotels/new', protect, newHotels)
router.post('/hotels/verify', protect, verifyHotel)
router.get('/hotels', protect, hotelsList)
router.get('/hotels/guests', protect, hotelGuestsList)
router.get('/hotels/history', protect, hotelGuestsHistory)
router.post('/changepass', protect, changePass)

module.exports = router