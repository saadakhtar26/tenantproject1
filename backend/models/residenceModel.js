const mongoose = require('mongoose')
const residenceSchema = mongoose.Schema({
    own_name: String,
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    own_cnic: String,
    own_father: String,
    own_phone: String,
    address: String,
    station_ID: mongoose.ObjectId,
    tenant_ID: mongoose.ObjectId,
    entryAt: { type: Date, default: Date.now() },
    exitAt: Date
})

module.exports = mongoose.model('residences', residenceSchema)
