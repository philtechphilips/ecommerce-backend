const { boolean } = require('joi')
const mongoose = require('mongoose')
const notificationSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    notification: {
        type: String,
    },
    title: {
        type: String,
    }
}, { timestamps: true });

notificationSchema.pre("save", function () {
    this.populate("userId");
});

notificationSchema.pre("findOne", function () {
    this.populate("userId");
});

notificationSchema.pre("find", function () {
    this.populate("userId");
});

notificationSchema.pre("findOneAndUpdate", function () {
    this.populate("userId");
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;