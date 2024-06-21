import ShopInfoModel from "../models/ShopInfo.js";

export const getAll = async (req, res) => {
    try {
        const info = await ShopInfoModel.find();

        res.json(info);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить информацию о магазине",
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new ShopInfoModel({
            title: req.body.title,
            description: req.body.description,
            contacts: req.body.contacts,
            logoImg: req.body.logoImg,
            banners: req.body.banners,
            colorTheme: req.body.colorTheme,

        });
        const info = await doc.save();

        res.json(info);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать информацию о магазине",
        });
    }
};
