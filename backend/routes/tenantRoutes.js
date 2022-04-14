const express = require('express')
const router = express.Router()
const {
    register, login, dashboard, delResidence, addResidence
} = require('../controllers/tenantController')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/dashboard').get(dashboard)
router.route('/residence').post(addResidence)
router.route('/residence').delete(delResidence)

module.exports = router