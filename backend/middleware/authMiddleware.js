const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const tenantModel = require('../models/tenantModel')
const hotelModel = require('../models/hotelModel')
const stationModel = require('../models/stationModel')

const protect = asyncHandler( async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await tenantModel.findById(decoded.id).select('-password')
            if(req.user==null){
                req.user = await hotelModel.findById(decoded.id).select('-password')
                if(req.user==null){
                    req.user = await stationModel.findById(decoded.id).select('-password')
                }
            }
            next()
        }
        catch (error){
            console.log(error)
            res.status(401)
            throw new Error('Not Authorized')
        }
    }

    if(!token){
        res.status(401)
        throw new Error('Not Authorized, No Token')
    }
})

module.exports = { protect }