import ProductModel from "../models/Product.js";
import SaleModel from "../models/Sale.js";

export const getAll = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("user").exec();

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
      genres: req.body.genres,
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

export const getMostPopular = async (req, res) => {
  try {
    const sales = await SaleModel.find().populate("user").exec();
    const products = await ProductModel.find().populate("user").exec();

    //Записать массив объектов, кот содержит информацию о повторениях обьектов
    let tableOfSales = new Map();

    for (let el of sales) {
      let count = 0;

      for (let item of sales) {
        if (el.title === item.title) {
          count++;
        }
      }
      tableOfSales.set(el.title, count)
    }

    //Отсортировать по убыванию
    let salesArray = [...tableOfSales];
    let sortedArray = salesArray.sort((a, b) => {
      return b[1] - a[1];
    })

    let arrayOfTitles = [];

    //Взять первые 8 названий из массива
    for(let i = 0; (i < sortedArray.length) && (i < 8); i++) {
      arrayOfTitles.push(sortedArray[i][0])
    }

    //Достать эти названия в массив в виде объектов
    let mostPopular = [];

    for(let title of arrayOfTitles) {
      for(let el of products) {
        if (title === el.title) {
          mostPopular.push(el);
          break;
        }
      }
    }

    res.json(mostPopular);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось получить товары",
    });
  }
};
