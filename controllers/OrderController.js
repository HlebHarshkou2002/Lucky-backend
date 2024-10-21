import OrderModel from "../models/Order.js";
import nodemailer from "nodemailer"
import { google } from "googleapis"




const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

async function sendMail(message) {
  try {
    const accessToken = await oAuth2Client.getAccessToken()

    //MAIL SENDING

    let transport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: "OAuth2",
        user: "hlebharshkou@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken
      },
    });

    const result = await transport.sendMail(message)

    return result
  } catch (error) {
    return error
  }
}

//MAIL SENDING ENDS

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
      products: req.body.products,
      pickupPoint: req.body.pickUpPoint,
      phone: req.body.phone,
      comment: req.body.comments,
      paymentMethod: req.body.paymentOption,
      contactEmail: req.body.email,
      contactFullName: req.body.fullName,
      deliveryLocation: req.body.pickUpPoint

    });

    const order = await doc.save();

    const adresses = {
      "point1": "г. Минск, ул. Рафиева, д. 42",
      "point2": "г. Минск, прт. Дзержинского, д. 111"
    }

    //MAIL SENDING
    const message = {
      from: 'LUCKY SHOP <hlebharshkou2002@mail.ru>',
      to: req.body.email,
      subject: 'Congrats!',
      text: 'Поздравляем! Вы оформили заказ',
      html:
        `<div>
            <h1>Поздравляем! ${req.body.fullName}, Вы оформили заказ в магазине Lucky!\n</h1>
            <p>Забрать заказ вы можете по адресу ${adresses[req.body.pickUpPoint]}.\n</p>
            <p>Статус заказа вы можете посмотреть в <a href="http://localhost:3000/profile">личном кабинете</a></p>
        </div>`,
    }

    sendMail(message)
      .then((result) => console.log("Email sent...", result))
      .catch((error) => console.log(error.message))

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



