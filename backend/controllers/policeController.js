const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const residenceModel = require('../models/residenceModel')
const tenantModel = require('../models/tenantModel')
const roomModel = require('../models/roomModel')
const hotelModel = require('../models/hotelModel')
const stationModel = require('../models/stationModel')

const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    const station = await stationModel.findOne({email})

    if(station && (await bcrypt.compare(password, station.password))){
        res.status(201).json({
            _id: station.id,
            token: generateToken(station._id)
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid Credentials')
    }
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
}

const dashboard = asyncHandler(async (req, res) => {
    const station = await stationModel.findById(req.user.id, 'email station_name sho_cnic sho_name phone address')
    const newHotels = await hotelModel.countDocuments( {isVerified: false, station_ID: req.user.id} )
    const hotelList = await hotelModel.countDocuments( {isVerified: true, station_ID: req.user.id} )
    const guestList = await roomModel.countDocuments( {isActive: true} )
    const guestHistory = await roomModel.countDocuments( {isActive: false} )

    const newTenants = await roomModel.countDocuments( {isActive: true, isVerified: false, station_ID: req.user.id} )
    const tenantList = await roomModel.countDocuments( {isActive: true, isVerified: true, station_ID: req.user.id} )
    const tenantHistory = await roomModel.countDocuments( {isActive: false, isVerified: false, station_ID: req.user.id} )
    
    //const station = await policeModel.findById( { '_id' : hotel.station_ID } )
    const result = {"station": station, "newHotels" : newHotels, "hotelList" : hotelList, "guestList" : guestList, "guestHistory" : guestHistory, "newTenants" : newTenants, "tenantsList" : tenantList, "tenantHistory" : tenantHistory}
    res.status(200).json(result)
})

const newTenants = asyncHandler(async (req, res) => {
    //find all residences in that police station area
    residenceModel.find(
        { 'station_ID' : req.user.id, 'isVerified' : false }, 
        'own_name own_cnic own_father own_phone address entryAt'
    )
    //match those residencies with their associated tenants
    .populate('tenant', '-_id cnic email father name phone')
    //return single response object
    //replaces tenant's ID with its corresponding object
    .exec(function(err, list){
        res.status(200).json(list)
    })
})

const verifyTenant = asyncHandler(async (req, res) => {
    if(!req.body.residence_ID){
        res.status(400)
        throw new Error('Please specify Residence ID')
    }
    const verifiedTenant = await residenceModel.findByIdAndUpdate( req.body.residence_ID, { isVerified: true } )
    if(verifiedTenant){
        res.status(200).json({"tenant" : verifiedTenant.id})
    }
    else{
        res.status(400)
        throw new Error('Invalid Data')
    }
})

const tenantList = asyncHandler(async (req, res) => {
    residenceModel.find(
        { 'station_ID' : req.user.id, 'isVerified' : true, 'isActive' : true }, 
        'own_name own_cnic own_father own_phone address entryAt'
    )
    .populate('tenant', '-_id cnic email father name phone')
    .exec(function(err, list){
        res.status(200).json(list)
    })
})

const tenantHistory = asyncHandler(async (req, res) => {
    residenceModel.find(
        { 'station_ID' : req.user.id, 'isVerified' : true, 'isActive' : false }, 
        'own_name own_cnic own_father own_phone address entryAt'
    )
    .populate('tenant', '-_id cnic email father name phone')
    .exec(function(err, list){
        res.status(200).json(list)
    })
})

const newHotels = asyncHandler(async (req, res) => {
    const hotelsList = await hotelModel.find( { 'station_ID' : req.user.id, 'isVerified' : false } )
    
    res.status(200).json(hotelsList)
})

const hotelsList = asyncHandler(async (req, res) => {
    const hotelsList = await hotelModel.find( { 'station_ID' : req.user.id, 'isVerified' : true } )
    
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

const changePass = asyncHandler(async (req, res) => {
    if(!req.body.oldPass || !req.body.newPass){
        res.status(400)
        throw new Error('Please add Old and New Passwords')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.oldPass, salt)
    
    const station = await stationModel.findById( req.user.id, '_id password' )
    if(!bcrypt.compareSync(req.body.oldPass, station.password)){
        res.status(400)
        throw new Error('Old Password Incorrect')
    }

    await stationModel.findByIdAndUpdate( req.user.id, {password: hashedPass} )
    res.status(200).json({"message" : "Password Changed Successfully"})
})

module.exports = {
    login,
    dashboard,
    newTenants,
    verifyTenant,
    tenantList,
    tenantHistory,
    newHotels,
    hotelsList,
    hotelGuestsList,
    hotelGuestsHistory,
    changePass
}