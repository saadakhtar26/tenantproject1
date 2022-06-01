const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const roomModel = require('../models/roomModel')
const hotelModel = require('../models/hotelModel')
const stationModel = require('../models/stationModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const register = asyncHandler(async (req, res) => {
    const { email, password, hotel_name, own_cnic, own_father, own_name, phone, address, totalRooms, station_ID } = req.body

    //Checking if all fields exist in request
    if(!email  || !password  || !hotel_name  || !own_cnic  || !own_father  || !own_name  || !phone  || !address  || !totalRooms  || !station_ID){
        res.status(400)
        throw new Error('Please check all fields')
    }

    //Checking if User already exists
    const userExists = await hotelModel.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('User already Registered')
    }

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
        station_ID
    })

    //Conditional Response
    if(hotel){
        res.status(201).json({
            _id: hotel.id,
            token: generateToken(hotel._id)
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    const hotel = await hotelModel.findOne({email})

    if(hotel && (await bcrypt.compare(password, hotel.password))){
        res.status(201).json({
            _id: hotel.id,
            token: generateToken(hotel._id)
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
    const hotel = await hotelModel.findById(req.user.id, 'hotel_name email phone isVerified totalRooms address station_ID')
    const owner = await hotelModel.findById(req.user.id, 'own_name own_cnic own_father')
    const station = await stationModel.findById(hotel.station_ID, 'station_name sho_name address phone')
    const guestCount = await roomModel.countDocuments( {isActive: true, hotel_ID: req.user.id} )
    const result = {"hotel": hotel, "owner" : owner, "station": station, "guest_count" : guestCount}
    res.status(200).json(result)
})

const guestList = asyncHandler(async (req, res) => {
    const guestList = await roomModel.find( { 'hotel_ID' : req.user.id, 'isActive' : true } )
    res.status(200).json(guestList)
})

const guestHistory = asyncHandler(async (req, res) => {
    const guestHistory = await roomModel.find( { 'hotel_ID' : req.user.id, 'isActive' : false } )
    res.status(200).json(guestHistory)
})

const addGuest = asyncHandler(async (req, res) => {
    if(!req.body.guest){
        res.status(400)
        throw new Error('Guest Data Empty')
    }
    const guest = await roomModel.create(req.body.guest)
    if(guest){
        res.status(200).json({"guest_ID" : guest.id})
    }
    else{
        res.status(400)
        throw new Error('Invalid Data')
    }
})

const delGuest = asyncHandler(async (req, res) => {
    if(!req.body.guest_ID){
        res.status(400)
        throw new Error('Please specify Guest ID')
    }
    await roomModel.findByIdAndUpdate( req.body.guest_ID, {isActive: false, exitAt: Date.now() } )
    res.status(200).json({"message" : "Guest Successfully Removed"})
})

const changePass = asyncHandler(async (req, res) => {
    if(!req.body.oldPass || !req.body.newPass){
        res.status(400)
        throw new Error('Please add Old and New Passwords')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.oldPass, salt)
    
    const hotel = await hotelModel.findById( req.user.id, '_id password' )
    if(hashedPass != hotel.password){
        res.status(400)
        throw new Error('Old Password Incorrect')
    }

    await hotelModel.findByIdAndUpdate( req.user.id, {password: hashedPass} )
    res.status(200).json({"message" : "Password Changed Successfully"})
})

module.exports = {
    register,
    login,
    dashboard,
    addGuest,
    delGuest,
    guestList,
    guestHistory,
    changePass
}