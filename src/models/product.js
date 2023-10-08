const { boolean } = require('joi')
const mongoose = require('mongoose')
const productSchemma = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    },
    categoryType: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    discountInPercentage: {
        type: Number,
        required: true,
    },
    highlights: {
        type: [String],
        required: true
    },
    instructions: {
        type: String,
        required: true
    },
    sizes: [{
        size: {
            type: String,
        },
        quantity: {
            type: Number,
        }
    }],
    colors: [{
        color: {
            type: String,
        },
        quantity: {
            type: Number,
        }
    }],
    quantity: {
        type: Number,
    },
    images: {
        type: [String],
        required: true
    },
    isTrending: {
        type: Boolean,
        required: true,
        default: false,
    }
}, { timestamps: true })

productSchemma.pre("save", function () {
    this.populate("categoryId");
});

productSchemma.pre("findOne", function () {
    this.populate("categoryId");
});

productSchemma.pre("find", function () {
    this.populate("categoryId");
});

productSchemma.pre("aggregate", async function () {
    this.lookup({
        from: "categories",
        localField: "categoryId",
        foreignField: "_id",
        as: "categoryId"
    });
});


productSchemma.pre("findOneAndUpdate", function () {
    this.populate("categoryId");
});

const Product = mongoose.model('Product', productSchemma)

module.exports = Product