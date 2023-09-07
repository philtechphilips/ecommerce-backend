const mongoose = require('mongoose')
const subCategorySchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    categoryType: {
        type: String,
        required: true,
    },
    subCategories: [{
        subCategory: {
            type: String,
            required: true
        }
    }],
}, { timestamps: true })

subCategorySchema.pre("save", function () {
    this.populate("categoryId");
});

subCategorySchema.pre("findOne", function () {
    this.populate("categoryId");
});

subCategorySchema.pre("find", function () {
    this.populate("categoryId");
});

subCategorySchema.pre("findOneAndUpdate", function () {
    this.populate("categoryId");
});

const SubCategory = mongoose.model('SubCategory', subCategorySchema)

module.exports = SubCategory