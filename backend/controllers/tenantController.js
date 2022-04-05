const asyncHandler = require('express-async-handler')
const tenantModel = require('../models/tenantModel')

const dashboard = asyncHandler(async (req, res) => {
    if(!req.body.tenant_ID){
        res.status(400)
        throw new Error('Please specify Tenant ID')
    }
    const tenant = await tenantModel.findOne( { '_Id' : req.body.tenant_ID } )
    res.status(200).json(tenant)
})

const addResidency = asyncHandler(async (req, res) => {
    if(!req.body.address){
        res.status(400)
        throw new Error('Please add an address')
    }
    const address = await tenantModel.create({
        text: req.body.address
    })
    res.status(200).json(address)
})

const delResidency = asyncHandler(async (req, res) => {
    const address = await tenantModel.findById(req.params.id)
    if(!req.params.id){
        res.status(400)
        throw new Error('Please add an ID')
    }
    await address.remove()
    res.status(200).json({id: req.params.id})
})

module.exports = {
    dashboard,
    addResidency,
    delResidency
}