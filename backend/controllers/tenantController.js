const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const residenceModel = require('../models/residenceModel')
const tenantModel = require('../models/tenantModel')
const stationModel = require('../models/stationModel')

const register = asyncHandler(async (req, res) => {
    const {email, password, name, father, phone, cnic} = req.body

    //Checking if all fields exist in request
    if(!email || !password || !name || !father || !phone || !cnic){
        res.status(400).json({ "status":"fail", "message":"Empty Credentials" })
    }

    //Checking if User already exists
    const userExists = await tenantModel.findOne({email})
    if(userExists){
        res.status(400).json({ "status":"fail", "message":"User already Registered" })
    }
    else{
        //Creating Account in Database
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const tenant = await tenantModel.create({
            email, 
            password: hashedPassword, 
            name, 
            father, 
            phone, 
            cnic
        })
    
        //Conditional Response
        if(tenant){
            res.status(201).json({ "status":"success", token: generateToken(tenant._id) })
        }
        else{
            res.status(400).json({ "status":"fail", "message":"Invalid User Data" })
        }
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if(!email || !password){
        res.status(400).json({ "status":"fail", "message": "Empty Credentials" })
    }
    else{
        const tenant = await tenantModel.findOne({email},'_id password')
        if(!tenant){
            res.status(400).json({ "status":"fail", "message": "User doesn't Exist" })
        }
        else{
            if((await bcrypt.compare(password, tenant.password))){
                res.status(201).json({ "status":"success", token: generateToken(tenant._id) })
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
    
    const tenant = await tenantModel.findById(req.user.id,'-_id -__v -password')
    
    const residence = await residenceModel.find({ 'tenant' : req.user.id, 'isActive' : true }, '_id -__v -tenant')
    
    if(residence==null || residence.length==0){
        const stations = await stationModel.find({},'_id station_name')
        res.status(200).json({ "status":"success", "tenant":tenant, "residence":null, "stations":stations })
    }
    else{
        const station = await stationModel.findById(residence.station,'-_id station_name')
        res.status(200).json({ "status":"success", "tenant":tenant, "residence":residence, "station":station })
    }
})

const addResidence = asyncHandler(async (req, res) => {
    if(!req.body.residence){
        res.status(400).json({ "status":"fail", "message":"Residence Info Empty" })
    }
    const DBresidence = await residenceModel.findOne({ "tenant":req.user.id })
    if(DBresidence!=null){
        res.status(400).json({ "status":"fail", "message":"Residence Already Added" })
    }
    else{
        req.body.residence.tenant = req.user.id
        const residence = await residenceModel.create(req.body.residence)
        if(residence){
            res.status(200).json({
                "status" : "success",
                "residence" : residence
            })
        }
        else{
            res.status(400).json({ "status":"fail", "message":"Invalid Residence Data" })
        }
    }
})

const delResidence = asyncHandler(async (req, res) => {
    if(!req.body.residence_ID){
        res.status(400).json({ "status":"fail", "message":"Please add Residence ID" })
    }
    await residenceModel.findByIdAndUpdate( req.body.residence_ID, {isActive: false, exitAt: Date.now()} )
    res.status(200).json({ "status":"success", "message" : "Residence Removed Successfully" })
})

const changePass = asyncHandler(async (req, res) => {
    if(!req.body.oldPass || !req.body.newPass){
        res.status(400).json({ "status":"fail", "message":"Please add Old and New Passwords" })
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.oldPass, salt)

    const tenant = await tenantModel.findById( req.user.id, '_id password' )

    if(!bcrypt.compareSync(req.body.oldPass, tenant.password)){
        res.status(400).json({ "status":"fail", "message":"Old Password Incorrect" })
    }

    await tenantModel.findByIdAndUpdate( req.user.id, {password: hashedPass} )
    res.status(200).json({ "status":"success", "message" : "Password Changed Successfully"})
})

module.exports = {
    dashboard,
    addResidence,
    delResidence,
    register,
    login,
    changePass
}