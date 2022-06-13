const mongoose = require('mongoose')
const roomSchema = mongoose.Schema({
    room: { type: Number, required: true },
    isActive: { type: Boolean, default: true, required:false },
    entryAt: { type: Date, default: Date.now(), required:false },
    exitAt: { type: Date, required:false },
    phone: { type: Number, required:true },
    hotel_ID: { type: mongoose.ObjectId, ref: 'hotel_test', required:true },
    name: { type: String, required:true },
    cnic: { type: String, required:true }
})

module.exports = mongoose.model('room_test', roomSchema)
