const express = require('express')
const router = express.Router()
const {
    dashboard, newTenants, verifyTenant, tenantList, tenantHistory, newHotels, hotelsList, hotelGuestsList, hotelGuestsHistory
} = require('../controllers/policeController')

router.route('/dashboard').get(dashboard)
router.route('/newTenants').get(newTenants)
router.route('/verifyTenant').post(verifyTenant)
router.route('/tenantsList').get(tenantList)
router.route('/tenantsHistory').get(tenantHistory)
router.route('/newHotels').get(newHotels)
router.route('/hotelsList').get(hotelsList)
router.route('/hotelGuestsList').get(hotelGuestsList)
router.route('/hotelGuestsHistory').get(hotelGuestsHistory)

module.exports = router