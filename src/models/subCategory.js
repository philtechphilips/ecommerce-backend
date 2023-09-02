const mongoose = require('mongoose')
const subCategorySchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    categoryType:{
        type: String,
        required: true,
        unique: true
    },
    subCategories: [{
        subCategory: {
            type: String,
            required: true
        }
    }],
}, { timestamps: true })

const subCategory = mongoose.model('SubCategory', subCategorySchema)

module.exports = subCategory