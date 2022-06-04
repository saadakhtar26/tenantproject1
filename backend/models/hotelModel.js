const mongoose = require('mongoose')
const hotelSchema = mongoose.Schema({
    email: String,
    password: String,
    hotel_name: String,
    own_cnic: String,
    own_father: String,
    own_name: String,
    phone: String,
    address: String,
    totalRooms: Number,
    station: [{ type: mongoose.ObjectId, ref: 'station_test' }],
    isVerified: { type: Boolean, default: false }
})

module.exports = mongoose.model('hotel_test', hotelSchema)
