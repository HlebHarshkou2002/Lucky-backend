import AdminProductModel from "../models/AdminProduct.js";


export const getAll = async (req, res) => {
  try {
    const products = await AdminProductModel.find().populate("user").exec();

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
    const product = await AdminProductModel.findById(productId);

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

    const doc = await AdminProductModel.findOneAndDelete({
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
    const doc = new AdminProductModel({
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