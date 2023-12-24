const { boolean } = require('joi')
const mongoose = require('mongoose')
const orderSchema = mongoose.Schema({
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
    orderId: {
        type: String,
        required: true
    },
    color: {
        type: String,
    },
    size: {
        type: String,
    },
    quantity: {
        type: String,
    },
    paymentReference: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        required: true,
        default: "Pending"
    },
}, { timestamps: true })

orderSchema.pre("save", function () {
    this.populate("productId");
    this.populate("userId");
});

orderSchema.pre("findOne", function () {
    this.populate("productId");
    this.populate("userId");
});

orderSchema.pre("find", function () {
    this.populate("productId");
    this.populate("userId");
});

orderSchema.pre("findOneAndUpdate", function () {
    this.populate("productId");
    this.populate("userId");
});

const Order = mongoose.model('Order', orderSchema)

module.exports = Order