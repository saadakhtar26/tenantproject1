const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const residenceModel = require('../models/residenceModel')
const tenantModel = require('../models/tenantModel')
const roomModel = require('../models/roomModel')
const hotelModel = require('../models/hotelModel')
const stationModel = require('../models/stationModel')
const randomstring = require("randomstring");
const sendToken = require('../utils/sendToken')

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if(!email || !password){
        res.status(400).json({ "status":"fail", "message" : "Empty Credentials"})
    }
    else{
        const station = await stationModel.findOne({email}).select('_id email password')
    
        if(!station){
            res.status(400).json({ "status":"fail", "message" : "Station doesn't Exist"})
        }
        else{
            if(station && (await bcrypt.compare(password, station.password))){
                res.status(201).json({
                    "status": "success",
                    token: generateToken(station._id)
                })
            }
            else{
                res.status(400).json({ "status":"fail", "message" : "Invalid Credentials"})
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
    const station = await stationModel.findById(req.user.id).select('email station_name sho_cnic sho_name phone address')
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
    residenceModel.find({ 'station' : req.user.id, 'isActive' : true, 'isVerified' : false })
    .select('own_name own_cnic own_father own_phone own_address address entryAt tenant')
    //match those residencies with their associated tenants
    .populate('tenant').select('cnic email father name phone')
    //return single response object
    //replaces tenant's ID with its corresponding object
    .exec(function(err, residenceList){
        res.status(200).json({ "status":"success", "list":residenceList })
    })
})

const verifyTenant = asyncHandler(async (req, res) => {
    if(!req.body.residence_ID){
        res.status(400).json({ "status":"fail", "message" : "Please specify Residence ID"})
    }
    const verifiedTenant = await residenceModel.findByIdAndUpdate( req.body.residence_ID, { isVerified: true } )
    if(verifiedTenant){
        res.status(200).json({ "status":"success"})
    }
    else{
        res.status(400).json({ "status":"fail", "message" : "Invalid Data"})
    }
})

const tenantList = asyncHandler(async (req, res) => {
    residenceModel.find({ 'station' : req.user.id, 'isVerified' : true, 'isActive' : true })
    .select('own_name own_cnic own_father own_phone own_address address entryAt')
    .populate('tenant', 'cnic email father name phone')
    .exec(function(err, list){
        res.status(200).json({ "status":"success", "list":list })
    })
})

const tenantHistory = asyncHandler(async (req, res) => {
    residenceModel.find({ 'station' : req.user.id, 'isVerified' : true, 'isActive' : false })
    .select('own_name own_cnic own_father own_phone own_address address entryAt exitAt'
    )
    .populate('tenant', 'cnic email father name phone')
    .exec(function(err, list){
        res.status(200).json({ "status":"success", "list":list })
    })
})

const newHotels = asyncHandler(async (req, res) => {
    const hotelsList = await hotelModel.find( { 'station' : req.user.id, 'isVerified' : false }).select('-password' )
    
    res.status(200).json({ "status":"success", "hotels":hotelsList })
})

const verifyHotel = asyncHandler(async (req, res) => {
    if(!req.body.hotel_ID){
        res.status(400).json({ "status":"fail", "message" : "Please specify hotel_ID"})
    }
    const verifiedHotel = await hotelModel.findByIdAndUpdate( req.body.hotel_ID, { isVerified: true } )
    if(verifiedHotel){
        res.status(200).json({ "status":"success"})
    }
    else{
        res.status(400).json({ "status":"fail", "message" : "Invalid Data"})
    }
})

const hotelsList = asyncHandler(async (req, res) => {
    const hotelsList = await hotelModel.find( { 'station' : req.user.id, 'isVerified' : true }).select('-password' )
    res.status(200).json({ "status":"success", "hotels":hotelsList })
})

const hotelData = asyncHandler(async (req, res) => {
    const hotel = await hotelModel.findOne( { 'station' : req.user.id, '_id' : req.query.hotel_ID }).select('-password')
    res.status(200).json({ "status":"success", "hotel":hotel })
})

const hotelGuestsList = asyncHandler(async (req, res) => {
    if(!req.query.hotel_ID){
        res.status(400).json({ "status":"fail", "message" : "Please specify Hotel ID"})
    }
    
    const hotelGuestsList = await roomModel.find( { 'hotel_ID' : req.query.hotel_ID, 'isActive' : true } )
    
    res.status(200).json({ "status":"success", "guests":hotelGuestsList })
})

const hotelGuestsHistory = asyncHandler(async (req, res) => {
    if(!req.query.hotel_ID){
        res.status(400).json({ "status":"fail", "message" : "Please specify Hotel ID"})
    }
    
    const hotelGuestsHistory = await roomModel.find( { 'hotel_ID' : req.query.hotel_ID, 'isActive' : false } )
    
    res.status(200).json({ "status":"success", "guests":hotelGuestsHistory })
})

const changePass = asyncHandler(async (req, res) => {
    if(!req.body.oldPass || !req.body.newPass){
        res.status(400).json({ "status":"fail", "message" : "Please add Old and New Passwords"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedNew = await bcrypt.hash(req.body.newPass, salt)
    
    const station = await stationModel.findById( req.user.id).select('_id password')
    if(!bcrypt.compareSync(req.body.oldPass, station.password)){
        res.status(400).json({ "status":"fail", "message" : "Old Password Incorrect"})
    }
    else{
        await stationModel.findByIdAndUpdate( req.user.id, {password: hashedNew} )
        res.status(200).json({ "status":"success"})
    }
})

const forgetPass = asyncHandler(async (req, res) => {
    if(!req.body.email){
        res.status(400).json({ "status":"fail", "message":"Please add Email" })
    }
    const station = await stationModel.findOne( { 'email' : req.body.email })
    if(!station){
        res.status(400).json({ "status":"fail", "message":"Invalid Email" })
    }
    else{
        const newToken = randomstring.generate({
            length: 6,
            charset: 'numeric'
        });
        const tokenAdded = await stationModel.findOneAndUpdate(
            { email: req.body.email }, 
            { token: newToken }
        )
        if(tokenAdded){
            await sendToken(req.body.email, 'Forgot Password', 
            'Use this OTP for password reset: '+newToken)
            res.status(200).json({ "status":"success", "message":"OTP send to "+req.body.email })
        }
        else{
            res.status(200).json({ "status":"fail", "message":"OTP not sent, contact iT support" })
        }
    }
})

const validateToken = asyncHandler(async (req, res) => {
    if(!req.body.email){
        res.status(400).json({ "status":"fail", "message":"Please add Email" })
    }
    if(!req.body.password){
        res.status(400).json({ "status":"fail", "message":"Please add Password" })
    }
    if(!req.body.token){
        res.status(400).json({ "status":"fail", "message":"Please add Token" })
    }
    const station = await stationModel.findOne( { 'email' : req.body.email })
    if(!station){
        res.status(400).json({ "status":"fail", "message":"Invalid Email" })
    }
    else{
        if(station.token==req.body.token){
            const salt = await bcrypt.genSalt(10)
            const hashedNew = await bcrypt.hash(req.body.password, salt)
            await stationModel.findOneAndUpdate( {email:req.body.email}, {password: hashedNew} )

            res.status(200).json({ "status":"success", "message":"Password Changed Succesfully" })
        }
        else{
            res.status(400).json({ "status":"fail", "message":"Invalid OTP" })
        }
    }
})

module.exports = {
    login,
    dashboard,
    newTenants,
    verifyTenant,
    verifyHotel,
    tenantList,
    tenantHistory,
    newHotels,
    hotelsList,
    hotelData,
    hotelGuestsList,
    hotelGuestsHistory,
    changePass,
    forgetPass,
    validateToken,
}