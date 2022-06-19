const mongoose = require('mongoose')
const hotelSchema = mongoose.Schema({
    email: { type: String, required:true },
    password: { type: String, required:true },
    hotel_name: { type: String, required:true },
    own_cnic: { type: String, required:true },
    own_father: { type: String, required:true },
    own_name: { type: String, required:true },
    phone: { type: String, required:true },
    address: { type: String, required:true },
    totalRooms: { type: Number, required:true },
    station: { type: mongoose.ObjectId, ref: 'station_test', required:true },
    totalGuests: { type: Number, min:0, default:0, required:false },
    isVerified: { type: Boolean, default: false, required:false },
    token: { type: String, required: false }
})

module.exports = mongoose.model('hotel_test', hotelSchema)
