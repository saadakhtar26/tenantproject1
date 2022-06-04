const mongoose = require('mongoose')
const roomSchema = mongoose.Schema({
    room: Number,
    isActive: { type: Boolean, default: true },
    entryAt: { type: Date, default: Date.now() },
    exitAt: { type: Date },
    phone: Number,
    hotel_ID: [{ type: mongoose.ObjectId, ref: 'hotel_test' }],
    name: String,
    cnic: String
})

module.exports = mongoose.model('room_test', roomSchema)
