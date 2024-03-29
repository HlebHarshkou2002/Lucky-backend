import mongoose from "mongoose";

const SupplyProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
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
    genres: {
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
        ref: 'Admin',
        required: true
    }
}, {
    timestamps: true,
})

export default mongoose.model('SupplyProduct', SupplyProductSchema);