const asyncHandler = require('express-async-handler')
const residenceModel = require('../models/tenantModel')

const dashboard = asyncHandler(async (req, res) => {
    /*if(!req.body.residence_ID){
        res.status(400)
        throw new Error('Please specify Residence ID')
    }
    const residence = await residenceModel.findOne( { '_id' : ObjectId(req.body.residence_ID) } )*/
    const residence = await residenceModel.find()
    res.status(200).json(residence)
})

const addResidence = asyncHandler(async (req, res) => {
    if(!req.body.residence){
        res.status(400)
        throw new Error('Residence Info Empty')
    }
    const residence = await residenceModel.create({
        own_name: req.body.own_name,
        own_cnic: req.body.own_cnic,
        own_father: req.body.own_father,
        own_phone: req.body.own_phone,
        address: req.body.address,
        station_ID: req.body.station_ID,
        tenant_ID: req.body.tenant_ID
    })
    res.status(200).json(address)
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