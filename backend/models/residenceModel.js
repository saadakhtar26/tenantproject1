const mongoose = require('mongoose')
const residenceSchema = mongoose.Schema({
    own_name: String,
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    own_cnic: String,
    own_father: String,
    own_phone: String,
    address: String,
    station: { type: mongoose.ObjectId, ref: 'station_test' },
    tenant: { type: mongoose.ObjectId, ref: 'tenant_test' },
    entryAt: { type: Date, default: Date.now() },
    exitAt: Date
})

module.exports = mongoose.model('residences', residenceSchema)
