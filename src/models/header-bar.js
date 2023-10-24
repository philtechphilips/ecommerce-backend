const { boolean } = require('joi')
const mongoose = require('mongoose')
const headerBarSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true })


const headerBar = mongoose.model('headerBar', headerBarSchema)

module.exports = headerBar