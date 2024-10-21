import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    orderStatus: {
        type: String,
        default: "process" //process, ready, paid
    },
    deliveryLocation: {
        type: String,
        default: "" 
    },
    pickupPoint: {
        type: String,
        default: "" 
    },
    phone: {
        type: String,
        default: ""
    },
    comment: {
        type: String,
        default: "" 
    },
    paymentMethod: {
        type: String,
        default: "" //cash, website, card by receive
    },
    paymentStatus: {
        type: String,
        default: "unpaid" //unpaid, paid
    },
    contactEmail: {
        type: String,
        default: ""
    },
    contactFullName: {
        type: String,
        default: ""
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
})

export default mongoose.model('Order', OrderSchema);