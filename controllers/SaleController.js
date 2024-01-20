import SaleModel from "../models/Sale.js";

export const getAll = async (req, res) => {
    try {
      const sales = await SaleModel.find().populate("user").exec();
  
      res.json(sales);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Не удалось получить продажи",
      });
    }
  };

export const create = async (req, res) => {
  try {
    const salesData = req.body;

    salesData.forEach(async (sale) => {
      try {
        const doc = new SaleModel({
          title: sale.title,
          price: sale.price,
          imgUrl: sale.imgUrl,
          user: req.userId
        });
        await doc.save();
      } catch (err) {
        console.error("Ошибка при сохранении записи:", err);
      }
    });

    res.json(salesData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать транзакцию",
    });
  }
};
