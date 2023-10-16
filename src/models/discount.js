const mongoose = require('mongoose')
const discountSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    discountPercentage: {
        type: Number,
    }, 
    expiryDate: {
        type: Date,
    }
}, { timestamps: true })

const Discount = mongoose.model('Discount', discountSchema)

module.exports = Discount