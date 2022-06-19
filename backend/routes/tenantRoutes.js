const express = require('express')
const router = express.Router()
const {
    register, login, dashboard, delResidence, addResidence, changePass, forgetPass, validateToken
} = require('../controllers/tenantController')
const {protect} = require('../middleware/authMiddleware')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/forgetpass').post(forgetPass)
router.route('/validate').post(validateToken)
router.get('/dashboard', protect, dashboard)
router.post('/residence', protect, addResidence)
router.delete('/residence', protect, delResidence)
router.post('/changepass', protect, changePass)

module.exports = router