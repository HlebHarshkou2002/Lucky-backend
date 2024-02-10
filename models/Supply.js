import mongoose from "mongoose";

const SupplySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    dateOfDelivery: {
        type: Date,
        required: true
    },
    comments: {
        type: String,
    },
    supplyStatus: {
        type: Boolean,
        required: true,
        unique: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    }],
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    }
}, {
    timestamps: true,
})

export default mongoose.model('Supply', SupplySchema);