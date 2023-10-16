const { boolean } = require('joi')
const mongoose = require('mongoose')
const cartSchema = mongoose.Schema({
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
    cartQuantity: {
        type: Number,
    },
    isPurchased:{
        type: Boolean,
        required: true,
        default: false
    },
    paymentReference:{
        type: String,
    }
}, { timestamps: true })

cartSchema.pre("save", function () {
    this.populate("productId");
    this.populate("userId");
});

cartSchema.pre("findOne", function () {
    this.populate("productId");
    this.populate("userId");
});

cartSchema.pre("find", function () {
    this.populate("productId");
    this.populate("userId");
});

cartSchema.pre("findOneAndUpdate", function () {
    this.populate("productId");
    this.populate("userId");
});

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart