const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        unique: false
    }, last_name: {
        type: String,
        required: true,
        unique: false
    }, gender: {
        type: String,
        unique: false
    }, dob: {
        type: String,
        unique: false
    }, email: {
        type: String,
        required: true,
        lowercase: true,
        min: 3,
    },
    phone_number: {
        type: String,
        min: 8,
    }, password: {
        type: String,
        required: ['Password field is required!', true],
    }, role: {
        type: String,
        required: true,
        default: 'user'
    },
    house_address: {
        type: String,
    },
    city: {
        type: String,
    },
    region: {
        type: String,
    },
    profileImgUrl: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    },
    isActive: {
        type: Boolean,
        required: true,
        default: true,
    },
}, { timestamps: true })

// userSchema.virtual('posts', {
//     ref: 'Post',
//     localField: '_id',
//     foreignField: 'author'
// })

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign(
        { _id: this._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "2 hours" }
      );
    await user.save()
    return token
}

userSchema.pre("findOne", function () {
  });
  
  userSchema.pre("find", function () {
 
  });
  
  userSchema.pre("findOneAndUpdate", function () {
  });

// userSchema.pre('save', async function (next) {
//     const user = this

//     if (user.isModified('password')) {
//         user.password = await bcrypt.hash(user.password, 8)
//     }

//     next()
// })

const User = mongoose.model('User', userSchema)

module.exports = User