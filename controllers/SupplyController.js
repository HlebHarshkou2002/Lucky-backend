import SupplyModel from "../models/Supply.js";
import ProductModel from "../models/Product.js";


export const create = async (req, res) => {
  
  try {
    const doc = new SupplyModel({
      title: req.body.title,
      dateOfDelivery: req.body.dateOfDelivery,
      comments: req.body.comments,
      products: req.body.products,
      provider: req.body.providerId,
    });

    const providerId = req.body.providerId

    for(let el of req.body.products) {
      await ProductModel.findOneAndUpdate({_id: el._id}, {$set: {provider: providerId}})
    }

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
    const supplies = await SupplyModel.find().populate('provider').exec();

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
    const supply = await SupplyModel.findById(supplyId).populate('provider').exec();

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

export const approveOne = async (req, res) => {
  try {
    const supplyId = req.body.id;
    let supply = await SupplyModel.findById(supplyId).populate('provider').exec();

    if (!supply) {
      return res.status(500).json({
        message: "Поставка не найдена",
      });
    }

    for(let el of supply.products) {
      const product = await ProductModel.findById(el._id);
      let newStoreCount = product.storeCount + el.storeCount;
      let newDeliveryPrice = el.deliveryPrice;
      await ProductModel.findOneAndUpdate({_id: el._id}, {$set: {storeCount: newStoreCount}})
      await ProductModel.findOneAndUpdate({_id: el._id}, {$set: {deliveryPrice: newDeliveryPrice}})
    }

    supply = await SupplyModel.findOneAndUpdate({_id: supplyId}, {$set: {supplyStatus: true}}).populate('provider').exec()

    res.json(supply);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить поставку",
    });
  }
}