const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const residenceModel = require('../models/residenceModel')
const roomModel = require('../models/roomModel')
const hotelModel = require('../models/hotelModel')
const stationModel = require('../models/stationModel')

const dashboard = asyncHandler(async (req, res) => {
    if(!req.body.station_ID){
        res.status(400)
        throw new Error('Please specify Station ID')
    }
    const station = await stationModel.findById(req.body.station_ID, 'email station_name sho_cnic sho_name phone address')
    const newHotels = await hotelModel.countDocuments( {isVerified: false, station_ID: req.body.station_ID} )
    const hotelList = await hotelModel.countDocuments( {isVerified: true, station_ID: req.body.station_ID} )
    const guestList = await roomModel.countDocuments( {isActive: true} )
    const guestHistory = await roomModel.countDocuments( {isActive: false} )

    const newTenants = await roomModel.countDocuments( {isActive: true, isVerified: false, station_ID: req.body.station_ID} )
    const tenantList = await roomModel.countDocuments( {isActive: true, isVerified: true, station_ID: req.body.station_ID} )
    const tenantHistory = await roomModel.countDocuments( {isActive: false, isVerified: false, station_ID: req.body.station_ID} )
    
    //const station = await policeModel.findById( { '_id' : hotel.station_ID } )
    const result = {"station": station, "newHotels" : newHotels, "hotelList" : hotelList, "guestList" : guestList, "guestHistory" : guestHistory, "newTenants" : newTenants, "tenantsList" : tenantList, "tenantHistory" : tenantHistory}
    res.status(200).json(result)
})

const newTenants = asyncHandler(async (req, res) => {
    if(!req.body.station_ID){
        res.status(400)
        throw new Error('Please specify Station ID')
    }
    
    const residencyList = await residenceModel.find( { 'station_ID' : req.body.station_ID, 'isVerified' : false } )
    
    res.status(200).json(residencyList)
})

const verifyTenant = asyncHandler(async (req, res) => {
    if(!req.body.residence_ID){
        res.status(400)
        throw new Error('Please specify Station and Residency ID')
    }
    await residenceModel.findByIdAndUpdate( req.body.residence_ID, { isVerified: true } )
    res.status(200).json({"message" : "Tenant Successfully Verified"})
})

const tenantList = asyncHandler(async (req, res) => {
    if(!req.body.station_ID){
        res.status(400)
        throw new Error('Please specify Station ID')
    }
    
    const residencyList = await residenceModel.find( { 'station_ID' : req.body.station_ID, 'isVerified' : true, 'isActive' : true } )
    
    res.status(200).json(residencyList)
})

const tenantHistory = asyncHandler(async (req, res) => {
    if(!req.body.station_ID){
        res.status(400)
        throw new Error('Please specify Station ID')
    }
    
    const residencyList = await residenceModel.find( { 'station_ID' : req.body.station_ID, 'isVerified' : true, 'isActive' : false } )
    
    res.status(200).json(residencyList)
})

const newHotels = asyncHandler(async (req, res) => {
    if(!req.body.station_ID){
        res.status(400)
        throw new Error('Please specify Station ID')
    }
    
    const hotelsList = await hotelModel.find( { 'station_ID' : req.body.station_ID, 'isVerified' : false } )
    
    res.status(200).json(hotelsList)
})

const hotelsList = asyncHandler(async (req, res) => {
    if(!req.body.station_ID){
        res.status(400)
        throw new Error('Please specify Station ID')
    }
    
    const hotelsList = await hotelModel.find( { 'station_ID' : req.body.station_ID, 'isVerified' : true } )
    
    res.status(200).json(hotelsList)
})

const hotelGuestsList = asyncHandler(async (req, res) => {
    if(!req.body.hotel_ID){
        res.status(400)
        throw new Error('Please specify Hotel ID')
    }
    
    const hotelGuestsList = await roomModel.find( { 'hotel_ID' : req.body.hotel_ID, 'isActive' : true } )
    
    res.status(200).json(hotelGuestsList)
})

const hotelGuestsHistory = asyncHandler(async (req, res) => {
    if(!req.body.hotel_ID){
        res.status(400)
        throw new Error('Please specify Hotel ID')
    }
    
    const hotelGuestsHistory = await roomModel.find( { 'hotel_ID' : req.body.hotel_ID, 'isActive' : false } )
    
    res.status(200).json(hotelGuestsHistory)
})

module.exports = {
    dashboard,
    newTenants,
    verifyTenant,
    tenantList,
    tenantHistory,
    newHotels,
    hotelsList,
    hotelGuestsList,
    hotelGuestsHistory
}