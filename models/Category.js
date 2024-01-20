import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    genres: {
        type: Array,
        default: []
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true,
})

export default mongoose.model('Category', CategorySchema);