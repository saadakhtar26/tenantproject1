const express = require('express')
const router = express.Router()
const {
    register, login, dashboard, delResidence, addResidence
} = require('../controllers/tenantController')
const {protect} = require('../middleware/authMiddleware')

router.route('/register').post(register)
router.route('/login').post(login)
router.get('/dashboard', protect, dashboard)
router.post('/residence', protect, addResidence)
router.delete('/residence', protect, delResidence)

module.exports = router