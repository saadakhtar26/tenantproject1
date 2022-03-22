const mongoose = require('mongoose')
const tenantSchema = mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add an Address']
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('tenant', tenantSchema)