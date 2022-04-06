const express = require('express')
const router = express.Router()
const {
    dashboard, delResidence, addResidence
} = require('../controllers/tenantController')

router.route('/dashboard').get(dashboard)
router.route('/residence').post(addResidence)
router.route('/residence/:id').delete(delResidence)

module.exports = router