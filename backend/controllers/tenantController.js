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
        res.status(400)
        throw new Error('Please check all fields')
    }

    //Checking if User already exists
    const userExists = await tenantModel.findOne({email})
    if(userExists){
        res.status(400)
        throw new Error('User alreadu Registered')
    }

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
        res.status(201).json({
            _id: tenant.id,
            token: generateToken(tenant._id)
        })
    }
    else{
        res.status(400)
        throw new Error('Invalid User Data')
    }
})

const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body
    const tenant = await tenantModel.findOne({email})

    if(tenant && (await bcrypt.compare(password, tenant.password))){
        res.status(201).json({
            _id: tenant.id,
            name: tenant.name,
            email: tenant.email,
            father: tenant.father,
            phone: tenant.phone,
            cnic: tenant.cnic,
            token: generateToken(tenant._id)
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
    const tenant = await tenantModel.findById(req.user.id).select('-password')
    const residence = await residenceModel.findOne( { 'tenant_ID' : req.user.id, 'isActive' : true }, 'isVerified address station_ID entryAt' ) || null
    
    let result
    if(residence!=null){
        const station = await stationModel.findOne( {'_id' : residence.station_ID}, 'station_name address' )
        result = {"tenant": tenant, "residence" : residence, "station_name" : station}
    }else{
        result = {"tenant": tenant, "residence" : null, "station_name" : null}
    }
    
    res.status(200).json(result)
})

const addResidence = asyncHandler(async (req, res) => {
    if(!req.body.residence){
        res.status(400)
        throw new Error('Residence Info Empty')
    }
    await residenceModel.create(req.body.residence)
    const result = {"message" : "Residence Successfully Added"}
    res.status(200).json(result)
})

const delResidence = asyncHandler(async (req, res) => {
    if(!req.body.residence_ID){
        res.status(400)
        throw new Error('Please add Residence ID')
    }
    await residenceModel.findByIdAndUpdate( req.body.residence_ID, {isActive: false, exitAt: Date.now()} )
    res.status(200).json({"message" : "Residence Removed Successfully"})
})

module.exports = {
    dashboard,
    addResidence,
    delResidence,
    register,
    login
}