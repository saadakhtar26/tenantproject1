const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')
const residenceModel = require('../models/residenceModel')
const tenantModel = require('../models/tenantModel')

const dashboard = asyncHandler(async (req, res) => {
    if(!req.body.tenant_ID){
        res.status(400)
        throw new Error('Please specify Tenant ID')
    }
    const tenant = await tenantModel.findById(req.body.tenant_ID)
    const residence = await residenceModel.findOne( { 'tenant_ID' : req.body.tenant_ID } )
    const result = {"tenant": tenant, "residence" : residence}
    res.status(200).json(result)
})

const addResidence = asyncHandler(async (req, res) => {
    if(!req.body.residence){
        res.status(400)
        throw new Error('Residence Info Empty')
    }
    const residence = await residenceModel.create(
        req.body.residence
    )
    res.status(200).json(residence)
})

const delResidence = asyncHandler(async (req, res) => {
    const residence = await residenceModel.findById(req.params.id)
    if(!req.params.id){
        res.status(400)
        throw new Error('Please add an ID')
    }
    await residence.remove()
    res.status(200).json({id: req.params.id})
})

module.exports = {
    dashboard,
    addResidence,
    delResidence
}