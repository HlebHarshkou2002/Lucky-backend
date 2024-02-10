import ProviderModel from "../models/Provider.js";

export const create = async (req, res) => {
  try {
    const doc = new ProviderModel({
      providerName: req.body.providerName,
      providerStatus: req.body.providerStatus,
      email: req.body.email,
      contactPerson: req.body.contactPerson,
      workingConditions: req.body.workingConditions,
    });

    const provider = await doc.save();

    res.json(provider);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось добавить поставщика",
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const providers = await ProviderModel.find();

    if (!providers) {
      return res.status(404).json({
        message: "Ну удалось получить список поставщиков",
      });
    }

    res.json(providers);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};
