import mongoose from "mongoose";

const ProviderSchema = new mongoose.Schema({
    providerName: {
        type: String,
        required: true
    },
    providerStatus: {
        type: Boolean,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    contactPerson: {
        type: String,
        required: false
    },
    workingConditions: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
})

export default mongoose.model('Provider', ProviderSchema);