import OrderModel from "../models/Order.js";

export const getAll = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("user")
      .populate("products")
      .exec();

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить заказы",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await OrderModel.findById(orderId)
      .populate("user")
      .populate("products")
      .exec();

    if (!order) {
      return res.status(500).json({
        message: "Заказ не найден",
      });
    }

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить заказ",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await OrderModel.find({ "user": userId })
      .populate("user")
      .populate("products")
      .exec();

    if (!orders) {
      return res.status(500).json({
        message: "Заказы не найдены",
      });
    }

    res.json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить заказ",
    });
  }
};


export const create = async (req, res) => {
  try {
    const doc = new OrderModel({
      user: req.body.userId,
      products: req.body.products
    });

    const order = await doc.save();

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать заказ",
    });
  }
};

export const ready = async (req, res) => {
  try {
    const orderId = req.body.orderId;

    await OrderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: { orderStatus: "ready" } }
    );

    res.json("Заказ успешно собран!");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать заказ",
    });
  }
};

export const approveOrder = async (req, res) => {
  try {
    const orderId = req.body.orderId;

    await OrderModel.findOneAndUpdate(
      { _id: orderId },
      { $set: { orderStatus: "paid" } }
    );

    res.json("Заказ успешно оплачен!");
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось оплатить заказ",
    });
  }
};



