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
    const address = await tenant.create({
        text: req.body.address
    })
    res.status(200).json(address)
})

const delResidency = asyncHandler(async (req, res) => {
    const address = await tenant.findById(req.params.id)
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