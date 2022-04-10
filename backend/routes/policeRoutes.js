const express = require('express')
const router = express.Router()
const {
    dashboard, newTenants /*addGuest, delGuest, guestList, guestHistory*/
} = require('../controllers/policeController')

router.route('/dashboard').get(dashboard)
router.route('/newTenants').get(newTenants)
/*router.route('/guestList').get(guestList)
router.route('/guestHistory').get(guestHistory)
router.route('/addGuest').post(addGuest)
router.route('/delGuest').delete(delGuest)*/

module.exports = router