import SupplyModel from "../models/Supply.js";


export const create = async (req, res) => {
  
  try {
    const doc = new SupplyModel({
      title: req.body.title,
      dateOfDelivery: req.body.dateOfDelivery,
      comments: req.body.comments,
      supplyStatus: req.body.supplyStatus,
      products: req.body.products,
      provider: req.body.providerId,
    });

    const supply = await doc.save();

    res.json(supply);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать поставку",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const supplies = await SupplyModel.find().populate('provider').populate('products').exec();

    if (!supplies) {
      return res.status(404).json({
        message: "Ну удалось получить список поставок",
      });
    }

    res.json(supplies);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};


export const getOne = async (req, res) => {
  try {
    const supplyId = req.params.id;
    const supply = await SupplyModel.findById(supplyId).populate('provider').populate('products').exec();

    if (!supply) {
      return res.status(500).json({
        message: "Поставка не найдена",
      });
    }

    res.json(supply);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить поставку",
    });
  }
};