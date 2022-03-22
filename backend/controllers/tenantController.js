const asyncHandler = require('express-async-handler')
const tenant = require('../models/tenantModel')

const dashboard = asyncHandler(async (req, res) => {
    const address = await tenant.find()

    res.status(200).json(address)
})

const addResidency = asyncHandler(async (req, res) => {
    if(!req.body.address){
        res.status(400)
        throw new Error('Please add an address')
    }

    res.status(200).json({message:'Add New Tenant Residency'})
})

const delResidency = asyncHandler(async (req, res) => {
    if(!req.params.id){
        res.status(400)
        throw new Error('Please add an ID')
    }
    
    res.status(200).json({message:`Delete Tenant Residency ID: ${req.params.id}, IF NOT Already`})
})

module.exports = {
    dashboard,
    addResidency,
    delResidency
}