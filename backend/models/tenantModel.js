const mongoose = require('mongoose')
const tenantSchema = mongoose.Schema({
    cnic: String,
    email: String,
    father: String,
    name: String,
    password: String,
    phone: String,
    token: { type: String, required: false }
})

module.exports = mongoose.model('tenant_test', tenantSchema)