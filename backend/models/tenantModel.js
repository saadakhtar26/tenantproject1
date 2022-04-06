const mongoose = require('mongoose')
const tenantSchema = mongoose.Schema({
    own_name: String,
    isActive: Boolean,
    isVerified: Boolean,
    own_cnic: String,
    own_father: String,
    own_phone: String,
    address: String,
    station_ID: ObjectId,
    tenant_ID: ObjectId,
    entryAt: Date,
    exitAt: Date
}, {
    timestamps: true,
})

module.exports = mongoose.model('tenant', tenantSchema)