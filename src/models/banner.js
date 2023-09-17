const { boolean } = require('joi')
const mongoose = require('mongoose')
const bannerSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
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
    }
}, { timestamps: true })

bannerSchema.pre("save", function () {
    this.populate("categoryId");
});

bannerSchema.pre("findOne", function () {
    this.populate("categoryId");
});

bannerSchema.pre("find", function () {
    this.populate("categoryId");
});

bannerSchema.pre("findOneAndUpdate", function () {
    this.populate("categoryId");
});

const Banner = mongoose.model('Banner', bannerSchema)

module.exports = Banner