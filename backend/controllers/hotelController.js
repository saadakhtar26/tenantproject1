const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const roomModel = require('../models/roomModel')
const hotelModel = require('../models/hotelModel')
const stationModel = require('../models/stationModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const randomstring = require("randomstring");
const sendToken = require('../utils/sendToken')

const register = asyncHandler(async (req, res) => {
    const { email, password, hotel_name, own_cnic, own_father, own_name, phone, address, totalRooms, station } = req.body

    //Checking if all fields exist in request
    if(!email  || !password  || !hotel_name  || !own_cnic  || !own_father  || !own_name  || !phone  || !address  || !totalRooms  || !station){
        res.status(400).json({ "status":"fail", "message":"Empty Credentials" })
    }

    //Checking if User already exists
    const userExists = await hotelModel.findOne({email}, 'email')
    if(userExists){
        res.status(400).json({ "status":"fail", "message":"User already Registered" })
    }
    else{
        //Creating Account in Database
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const hotel = await hotelModel.create({
            password: hashedPassword,
            email, 
            hotel_name, 
            own_cnic, 
            own_father, 
            own_name, 
            phone, 
            address, 
            totalRooms,
            station,
        })
    
        //Conditional Response
        if(hotel){
            res.status(201).json({
                "status" : "success",
                token: generateToken(hotel._id)
            })
        }
        else{
            res.status(400).json({ "status":"fail", "message":"Invalid User Data" })
        }
    }
})

const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        res.status(400).json({ "status":"fail", "message":"Empty Credentials" })
    }
    else{
        const hotel = await hotelModel.findOne({email}).select('_id email password')
    
        if(!hotel){
            res.status(400).json({ "status":"fail", "message":"User doesn't Exist" })
        }
        else{
            if(await bcrypt.compare(password, hotel.password)){
                res.status(201).json({
                    "status" : "success",
                    token: generateToken(hotel._id)
                })
            }
            else{
                res.status(400).json({ "status":"fail", "message":"Invalid Credentials" })
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

    hotelModel.findById(req.user.id).select('hotel_name email phone isVerified totalRooms totalGuests address')
    .populate('station', 'station_name')
    .exec(async function(err, hotel){
        const owner = await hotelModel.findById(req.user.id).select('own_name own_cnic own_father')
        const result = { "status": "success", "hotel": hotel, "owner" : owner }
        res.status(200).json(result)
    })
})

const guestList = asyncHandler(async (req, res) => {
    const guestList = await roomModel.find( { 'hotel_ID' : req.user.id, 'isActive' : true } )
    res.status(200).json({ "status":"success", "guests": guestList })
})

const guestHistory = asyncHandler(async (req, res) => {
    const guestHistory = await roomModel.find( { 'hotel_ID' : req.user.id, 'isActive' : false } )
    res.status(200).json({ "status":"success", "guests":guestHistory })
})

const addGuest = asyncHandler(async (req, res) => {
    if(!req.body.guest){
        res.status(400).json({ "status":"fail", "message":"Guest Data Empty" })
    }
    
    const hotel = await hotelModel.findById(req.user.id).select('totalRooms')
    const isBooked = await roomModel.countDocuments({"room":req.body.guest.room, "isActive":true})

    if( req.body.guest.room > hotel.totalRooms ){
        res.status(400).json({ "status":"fail", "message":"Maximum Room is: "+hotel.totalRooms })
    }
    else{
        if(isBooked){
            res.status(400).json({ "status":"fail", "message":"Room Already Occupied" })
        }
        else{
            req.body.guest.hotel_ID = req.user.id
            const guest = await roomModel.create(req.body.guest)
            await hotelModel.findByIdAndUpdate( req.user.id, { $inc:{totalGuests:1} } )
            if(guest){
                res.status(200).json({ "status":"success" })
            }
            else{
                res.status(400).json({ "status":"fail", "message":"Invalid Data" })
            }
        }
    }
})

const delGuest = asyncHandler(async (req, res) => {
    if(!req.body.guest_ID){
        res.status(400).json({ "status":"fail", "message":"Please specify Guest ID" })
    }
    await roomModel.findByIdAndUpdate( req.body.guest_ID, {isActive: false, exitAt: Date.now() } )
    await hotelModel.findByIdAndUpdate( req.user.id, { $inc:{totalGuests:-1} } )
    res.status(200).json({ "status":"success" })
})

const changePass = asyncHandler(async (req, res) => {
    if(!req.body.oldPass || !req.body.newPass){
        res.status(400).json({ "status":"fail", "message" : "Please add Old and New Passwords"})
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.newPass, salt)
    
    const hotel = await hotelModel.findById( req.user.id).select('_id password' )
    if(!bcrypt.compareSync(req.body.oldPass, hotel.password)){
        res.status(400).json({ "status":"fail", "message" : "Old Password Incorrect"})
    }

    await hotelModel.findByIdAndUpdate( req.user.id, {password: hashedPass} )
    res.status(200).json({ "status":"success" })
})

const stationsList = asyncHandler(async (req, res) => {
    const stationsList = await stationModel.find({}, '_id station_name')
    res.status(200).json({ "status":"success", "stations": stationsList })
})

const forgetPass = asyncHandler(async (req, res) => {
    if(!req.body.email){
        res.status(400).json({ "status":"fail", "message":"Please add Email" })
    }
    const hotel = await hotelModel.findOne( { 'email' : req.body.email })
    if(!hotel){
        res.status(400).json({ "status":"fail", "message":"Invalid Email" })
    }
    else{
        const newToken = randomstring.generate({
            length: 6,
            charset: 'numeric'
        });
        const tokenAdded = await hotelModel.findOneAndUpdate(
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
    const hotel = await hotelModel.findOne( { 'email' : req.body.email })
    if(!hotel){
        res.status(400).json({ "status":"fail", "message":"Invalid Email" })
    }
    else{
        if(hotel.token==req.body.token){
            const salt = await bcrypt.genSalt(10)
            const hashedNew = await bcrypt.hash(req.body.password, salt)
            await hotelModel.findOneAndUpdate( {email:req.body.email}, {password: hashedNew} )

            res.status(200).json({ "status":"success", "message":"Password Changed Succesfully" })
        }
        else{
            res.status(400).json({ "status":"fail", "message":"Invalid OTP" })
        }
    }
})

module.exports = {
    register,
    login,
    dashboard,
    addGuest,
    delGuest,
    guestList,
    guestHistory,
    changePass,
    stationsList,
    forgetPass,
    validateToken,
}