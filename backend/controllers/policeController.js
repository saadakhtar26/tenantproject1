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
    const { email, password } = req.body

    if(!email || !password){
        res.status(400).json({ "status":"success", "message" : "Empty Credentials"})
    }
    else{
        const station = await stationModel.findOne({email}, '_id password')
    
        if(!station){
            res.status(400).json({ "status":"success", "message" : "Station doesn't Exist"})
        }
        else{
            if(station && (await bcrypt.compare(password, station.password))){
                res.status(201).json({
                    "status": "success",
                    token: generateToken(station._id)
                })
            }
            else{
                res.status(400).json({ "status":"success", "message" : "Invalid Credentials"})
            }
        }
    }
})

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    })
}

const dashboard = asyncHandler(async (req, res) => {
    const station = await stationModel.findById(req.user.id, '-_id email station_name sho_cnic sho_name phone address')
    const newHotels = await hotelModel.countDocuments( {isVerified: false, station: req.user.id} )
    const hotelList = await hotelModel.countDocuments( {isVerified: true, station: req.user.id} )
    const guestList = await roomModel.countDocuments( {isActive: true} )
    const guestHistory = await roomModel.countDocuments( {isActive: false} )

    const newTenants = await residenceModel.countDocuments( {isActive: true, isVerified: false, station: req.user.id} )
    const tenantList = await residenceModel.countDocuments( {isActive: true, isVerified: true, station: req.user.id} )
    const tenantHistory = await residenceModel.countDocuments( {isActive: false, station: req.user.id} )
    
    const result = { 
        "status":"success", 
        "station": station, 
        "newHotels" : newHotels, 
        "hotelList" : hotelList, 
        "guestList" : guestList, 
        "guestHistory" : guestHistory, 
        "newTenants" : newTenants, 
        "tenantsList" : tenantList, 
        "tenantHistory" : tenantHistory
    }
    res.status(200).json(result)
})

const newTenants = asyncHandler(async (req, res) => {
    //find all residences in that police station area
    residenceModel.find(
        { 'station' : req.user.id, 'isVerified' : false }, 
        'own_name own_cnic own_father own_phone address entryAt'
    )
    //match those residencies with their associated tenants
    .populate('tenant', '-_id cnic email father name phone')
    //return single response object
    //replaces tenant's ID with its corresponding object
    .exec(function(err, list){
        res.status(200).json({ "status":"success", "list":list })
    })
})

const verifyTenant = asyncHandler(async (req, res) => {
    if(!req.body.residence_ID){
        res.status(400).json({ "status":"fail", "message" : "Please specify Residence ID"})
    }
    const verifiedTenant = await residenceModel.findByIdAndUpdate( req.body.residence_ID, { isVerified: true } )
    if(verifiedTenant){
        res.status(200).json({ "status":"success", "tenant" : verifiedTenant.id})
    }
    else{
        res.status(400).json({ "status":"fail", "message" : "Invalid Data"})
    }
})

const tenantList = asyncHandler(async (req, res) => {
    residenceModel.find(
        { 'station' : req.user.id, 'isVerified' : true, 'isActive' : true }, 
        'own_name own_cnic own_father own_phone address entryAt'
    )
    .populate('tenant', '-_id cnic email father name phone')
    .exec(function(err, list){
        res.status(200).json({ "status":"success", "list":list })
    })
})

const tenantHistory = asyncHandler(async (req, res) => {
    residenceModel.find(
        { 'station' : req.user.id, 'isVerified' : true, 'isActive' : false }, 
        'own_name own_cnic own_father own_phone address entryAt exitAt'
    )
    .populate('tenant', '-_id cnic email father name phone')
    .exec(function(err, list){
        res.status(200).json({ "status":"success", "list":list })
    })
})

const newHotels = asyncHandler(async (req, res) => {
    const hotelsList = await hotelModel.find( { 'station' : req.user.id, 'isVerified' : false } )
    
    res.status(200).json({ "status":"success", "hotels":hotelsList })
})

const hotelsList = asyncHandler(async (req, res) => {
    const hotelsList = await hotelModel.find( { 'station' : req.user.id, 'isVerified' : true } )
    
    res.status(200).json({ "status":"success", "hotels":hotelsList })
})

const hotelGuestsList = asyncHandler(async (req, res) => {
    if(!req.body.hotel_ID){
        res.status(400).json({ "status":"fail", "message" : "Please specify Hotel ID"})
    }
    
    const hotelGuestsList = await roomModel.find( { 'hotel_ID' : req.body.hotel_ID, 'isActive' : true } )
    
    res.status(200).json({ "status":"success", "guests":hotelGuestsList })
})

const hotelGuestsHistory = asyncHandler(async (req, res) => {
    if(!req.body.hotel_ID){
        res.status(400).json({ "status":"fail", "message" : "Please specify Hotel ID"})
    }
    
    const hotelGuestsHistory = await roomModel.find( { 'hotel_ID' : req.body.hotel_ID, 'isActive' : false } )
    
    res.status(200).json({ "status":"success", "guests":hotelGuestsHistory })
})

const changePass = asyncHandler(async (req, res) => {
    if(!req.body.oldPass || !req.body.newPass){
        res.status(400).json({ "status":"fail", "message" : "Please add Old and New Passwords"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedOld = await bcrypt.hash(req.body.oldPass, salt)
    const hashedNew = await bcrypt.hash(req.body.newPass, salt)
    
    const station = await stationModel.findById( req.user.id, '_id password' )
    if(!bcrypt.compareSync(req.body.oldPass, station.password)){
        res.status(400).json({ "status":"fail", "message" : "Old Password Incorrect"})
    }
    else{
        await stationModel.findByIdAndUpdate( req.user.id, {password: hashedNew} )
        res.status(200).json({ "status":"success", "message" : "Password Changed Successfully"})
    }
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