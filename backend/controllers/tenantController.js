const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const residenceModel = require('../models/residenceModel')
const tenantModel = require('../models/tenantModel')
const stationModel = require('../models/stationModel')

const dashboard = asyncHandler(async (req, res) => {
    if(!req.body.tenant_ID){
        res.status(400)
        throw new Error('Please specify Tenant ID')
    }
    const tenant = await tenantModel.findById(req.body.tenant_ID)
    const residence = await residenceModel.findOne( { 'tenant_ID' : req.body.tenant_ID, 'isActive' : true }, 'isVerified address station_ID entryAt' )
    const station = await stationModel.findOne( {'_id' : residence.station_ID}, 'station_name address' )
    const result = {"tenant": tenant, "residence" : residence, "station_name" : station}
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
    delResidence
}