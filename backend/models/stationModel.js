const mongoose = require('mongoose')
const stationSchema = mongoose.Schema({
    email: String,
    password: String,
    station_name: String,
    sho_cnic: String,
    sho_name: String,
    phone: String,
    address: String,
    token: { type: String, required: false }
})

module.exports = mongoose.model('station_test', stationSchema)
