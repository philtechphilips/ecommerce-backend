const { boolean } = require('joi')
const mongoose = require('mongoose')
const wishlistSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    wishlistQuantity: {
        type: Number,
    }
}, { timestamps: true })

wishlistSchema.pre("save", function () {
    this.populate("productId");
    this.populate("userId");
});

wishlistSchema.pre("findOne", function () {
    this.populate("productId");
    this.populate("userId");
});

wishlistSchema.pre("find", function () {
    this.populate("productId");
    this.populate("userId");
});

wishlistSchema.pre("findOneAndUpdate", function () {
    this.populate("productId");
    this.populate("userId");
});

const Wishlist = mongoose.model('Wishlist', wishlistSchema)

module.exports = Wishlist