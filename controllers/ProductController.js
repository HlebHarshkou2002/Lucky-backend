import { stringify } from "querystring";
import ProductModel from "../models/Product.js";
import SaleModel from "../models/Sale.js";
import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";

export const getAll = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate("user")
      .populate("provider")
      .exec();

    const productsToView = [];
    for (let el of products) {
      if (el.storeCount !== 0) {
        productsToView.push(el);
      }
    }

    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить товары",
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await ProductModel.findById(productId);

    if (!product) {
      return res.status(500).json({
        message: "Статья не найдена",
      });
    }

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить товар",
    });
  }
};

export const remove = async (req, res) => {
  try {
    const productId = req.params.id;

    const doc = await ProductModel.findOneAndDelete({
      _id: productId,
    });
    if (!doc) {
      res.status(404).json({
        message: "Товар не найден",
      });
    }

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось удалить товар",
    });
  }
};

export const create = async (req, res) => {
  try {
    const doc = new ProductModel({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      author: req.body.author,
      imgUrl: req.body.imgUrl,
      categories: req.body.categories,
      ageRestriction: req.body.ageRestriction,
      complexity: req.body.complexity,
      rating: req.body.rating,
      user: req.userId,
    });

    const product = await doc.save();

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать товар",
    });
  }
};

export const update = async (req, res) => {
  try {
    const productId = req.params.id;

    await ProductModel.updateOne(
      {
        _id: productId,
      },
      {
        title: req.body.title,
        price: req.body.price,
        // description: req.body.description,
        author: req.body.author,
        // imgUrl: req.body.imgUrl,
        // ageRestriction: req.body.ageRestriction,
        // complexity: req.body.complexity,
        // rating: req.body.rating,
        // user: req.userId,
        // genres: req.body.genres.split(","),
      }
    );

    res.json({
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось обновить товар",
    });
  }
};

export const approveSale = async (req, res) => {
  try {
    const salesData = req.body;

    for (let el of salesData) {
      const product = await ProductModel.findById(el._id);
      if (!product) {
        return res.status(500).json({
          message: "Товар не найден",
        });
      }
      let newStoreCount = el.storeCount - 1;
      let newSaleCount = el.saleCount + 1;

      await ProductModel.findOneAndUpdate(
        { _id: el._id },
        { $set: { storeCount: newStoreCount } }
      );
      await ProductModel.findOneAndUpdate(
        { _id: el._id },
        { $set: { saleCount: newSaleCount } }
      );

      //Алгоритм для того чтобы фильтровать по дате
      let newSalesArray = product.sales;
      let date = new Date();
      let dateString = new Date().toLocaleDateString();
      let isIncludes = false;

      for (let sale of newSalesArray) {
        if (
          // sale.yearOfSale === date.getFullYear() &&
          // sale.monthOfSale === date.getMonth() &&
          // sale.dayOfSale === date.getDate() &&
          sale.dateOfSale === dateString
        ) {
          sale.saleCount += 1;
          isIncludes = true;
          break;
        }

        console.log(newSalesArray);
      }

      await ProductModel.findOneAndUpdate(
        { _id: el._id },
        { $set: { sales: newSalesArray } }
      );

      if (newSalesArray.length === 0) {
        isIncludes = true;
        newSalesArray.push({
          dateOfSale: dateString,
          yearOfSale: date.getFullYear(),
          monthOfSale: date.getMonth()+1,
          dayOfSale: date.getDate(),
          saleCount: 1,
        });
        await ProductModel.findOneAndUpdate(
          { _id: el._id },
          { $set: { sales: newSalesArray } }
        );
      }

      if (!isIncludes) {
        newSalesArray.push({
          dateOfSale: dateString,
          yearOfSale: date.getFullYear(),
          monthOfSale: date.getMonth()+1,
          dayOfSale: date.getDate(),
          saleCount: 1,
        });
        await ProductModel.findOneAndUpdate(
          { _id: el._id },
          { $set: { sales: newSalesArray } }
        );
      }
    }

    res.json(salesData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось создать оплату",
    });
  }
};


export const getMostPopular = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("user").exec();

    const productsToView = [];
    for (let el of products) {
      if (el.storeCount !== 0) {
        productsToView.push(el);
      }
    }

    productsToView.sort(function (a, b) {
      return b.saleCount - a.saleCount;
    });

    res.json(productsToView.slice(0, 8));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить товары",
    });
  }
};

export const getNewProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("user").exec();

    const productsToView = [];
    for (let el of products) {
      if (el.storeCount !== 0) {
        productsToView.push(el);
      }
    }

    productsToView.sort(function (a, b) {
      return b.createdAt - a.createdAt;
    });

    res.json(productsToView.slice(0, 8));
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить товары",
    });
  }
};

export const exportReport = async (req, res) => {
  try {
    const data = req.body.products;

    fs.writeFile("reports/data.xls", JSON.stringify(data), function (error) {
      if (error) {
        return console.log(error);
      }
      console.log("Файл успешно записан");
    });

    let filepath = path.resolve("reports/data.xls");

    res.json({
      success: true,
      filepath
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось сохранить отчёт",
    });
  }
};
