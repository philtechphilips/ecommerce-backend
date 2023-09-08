const mongoose = require('mongoose')
const bannerSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    body: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
    buttonText: {
        type: String,
        required: true,
    },
    buttonUrl: {
        type: String,
    },
}, { timestamps: true })

const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner