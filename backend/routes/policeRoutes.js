const express = require('express')
const router = express.Router()
const {
    login, dashboard, newTenants, verifyTenant, verifyHotel, tenantList, tenantHistory, newHotels, hotelsList, hotelData, hotelGuestsList, hotelGuestsHistory, changePass, forgetPass, validateToken
} = require('../controllers/policeController')
const {protect} = require('../middleware/authMiddleware')

router.route('/login').post(login)
router.route('/forgetpass').post(forgetPass)
router.route('/validate').post(validateToken)
router.get('/dashboard', protect, dashboard)
router.get('/tenants', protect, tenantList)
router.get('/tenants/new', protect, newTenants)
router.post('/tenants/verify', protect, verifyTenant)
router.get('/tenants/history', protect, tenantHistory)
router.get('/hotels/new', protect, newHotels)
router.post('/hotels/verify', protect, verifyHotel)
router.get('/hotels', protect, hotelsList)
router.get('/hotel', protect, hotelData)
router.get('/hotels/guests', protect, hotelGuestsList)
router.get('/hotels/history', protect, hotelGuestsHistory)
router.post('/changepass', protect, changePass)

module.exports = router