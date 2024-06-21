import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
    },
    deliveryPrice: {
        type: Number,
        required: true,
        default: 0
    },
    storeCount: {
        type: Number,
        required: true,
        default: 0
    },
    saleCount: {
        type: Number,
        required: true,
        default: 0
    },
    sales: {
        type: Array,
        default: []
    },
    orderCount: {
        type: Number,
        required: true,
        default: 0
    },
    orders: {
        type: Array,
        default: []
    },
    description: {
        type: String,
        default: ''
    },
    author: {
        type: String,
        default: ''
    },
    imgUrl: String, 
    categories: {
        type: Array,
        default: []
    },
    ageRestriction: {
        type: Number,
        default: 18
    },
    complexity: {
        type: String,
        default: "Junior"
    },
    rating: {
        type: Number,
        default: 3
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        default: null
    }
}, {
    timestamps: true,
})

export default mongoose.model('Product', ProductSchema);