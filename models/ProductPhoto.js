import mongoose from "mongoose";

const ProductPhotoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    imgUrl: String, 
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
})

export default mongoose.model('ProductPhoto', ProductPhotoSchema);