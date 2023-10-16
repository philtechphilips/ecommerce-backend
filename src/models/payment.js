const { boolean } = require('joi')
const mongoose = require('mongoose')
const paymentSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    paymentStatus: {
        type: String,
        required: true
    },
    paymentReference: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    initiateDate: {
        type: Date,
        required: true,
    },
    paidDate: {
        type: Date,
        required: true,
    },
}, { timestamps: true })

paymentSchema.pre("save", function () {
    this.populate("userId");
});

paymentSchema.pre("findOne", function () {
    this.populate("userId");
});

paymentSchema.pre("find", function () {
    this.populate("userId");
});

paymentSchema.pre("findOneAndUpdate", function () {
    this.populate("userId");
});

const Payment = mongoose.model('Payment', paymentSchema)

module.exports = Payment