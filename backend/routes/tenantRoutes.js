const express = require('express')
const router = express.Router()
const {
    dashboard, addResidency, delResidency
} = require('../controllers/tenantController')

router.route('/dashboard').get(dashboard)
router.route('/residency').post(addResidency)
router.route('/residency/:id').delete(delResidency)

module.exports = router