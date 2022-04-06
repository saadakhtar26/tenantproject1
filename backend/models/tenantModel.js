const mongoose = require('mongoose')
const tenantSchema = mongoose.Schema({
    cnic: String,
    email: String,
    father: String,
    name: String,
    pass: String,
    phone: String
})

module.exports = mongoose.model('tenant_test', tenantSchema)