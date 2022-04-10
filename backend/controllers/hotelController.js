const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const roomModel = require('../models/roomModel')
const hotelModel = require('../models/hotelModel')

const dashboard = asyncHandler(async (req, res) => {
    if(!req.body.hotel_ID){
        res.status(400)
        throw new Error('Please specify Hotel ID')
    }
    const hotel = await hotelModel.findById(req.body.hotel_ID, 'hotel_name email phone isVerified totalRooms address station_ID')
    const owner = await hotelModel.findById(req.body.hotel_ID, 'own_name own_cnic own_father')
    //const station = await policeModel.findById( { '_id' : hotel.station_ID } )
    const guestCount = await roomModel.countDocuments( {isActive: true, hotel_ID: req.body.hotel_ID} )
    const result = {"hotel": hotel, "owner" : owner, "guest_count" : guestCount}
    res.status(200).json(result)
})

const guestList = asyncHandler(async (req, res) => {
    if(!req.body.hotel_ID){
        res.status(400)
        throw new Error('Please specify Hotel ID')
    }
    const guestList = await roomModel.find( { 'hotel_ID' : req.body.hotel_ID, 'isActive' : true } )
    res.status(200).json(guestList)
})

const guestHistory = asyncHandler(async (req, res) => {
    if(!req.body.hotel_ID){
        res.status(400)
        throw new Error('Please specify Hotel ID')
    }
    const guestHistory = await roomModel.find( { 'hotel_ID' : req.body.hotel_ID, 'isActive' : false } )
    res.status(200).json(guestHistory)
})

const addGuest = asyncHandler(async (req, res) => {
    if(!req.body.guest){
        res.status(400)
        throw new Error('Guest Data Empty')
    }
    const guest = await roomModel.create(
        req.body.guest
    )
    res.status(200).json(guest)
})

const delGuest = asyncHandler(async (req, res) => {
    if(!req.body.guest_ID){
        res.status(400)
        throw new Error('Please specify Guest ID')
    }
    await roomModel.findByIdAndUpdate( req.body.guest_ID, {isActive: false, exitAt: Date.now() } )
    res.status(200).json({id: req.body.guest_ID})
})

module.exports = {
    dashboard,
    addGuest,
    delGuest,
    guestList,
    guestHistory
}