const mongoose = require('mongoose')
const bannerSchema = mongoose.Schema({
    category: {
        type: String,
        required: true,
        unique: true
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

const Trending = mongoose.model('Trending', trendingSchema)

module.exports = Trending