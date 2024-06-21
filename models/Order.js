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
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
})

export default mongoose.model('Order', OrderSchema);