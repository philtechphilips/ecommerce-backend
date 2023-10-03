const mongoose = require('mongoose')
const featuredProductSchema = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
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
    active: {
        type: Boolean,
        required: true,
        default: false,
    },    

}, { timestamps: true })

featuredProductSchema.pre("save", function () {
    this.populate("categoryId");
});

featuredProductSchema.pre("findOne", function () {
    this.populate("categoryId");
});

featuredProductSchema.pre("find", function () {
    this.populate("categoryId");
});

featuredProductSchema.pre("findOneAndUpdate", function () {
    this.populate("categoryId");
});


const FeauredProduct = mongoose.model('FeauredProduct', featuredProductSchema)

module.exports = FeauredProduct