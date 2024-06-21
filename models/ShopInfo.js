import mongoose from "mongoose";

const ShopInfoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            default: ""
        },
        description: {
            type: String,
            required: true,
            default: ""
        },
        contacts: {
            type: String,
            required: true,
            default: ""
        },
        logoImg: {
            type: String,
            required: true,
            default: ""
        },
        banners: {
            type: Array,
            default: []
        },
        colorTheme: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("ShopInfo", ShopInfoSchema);
