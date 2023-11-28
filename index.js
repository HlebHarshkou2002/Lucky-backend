import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import UserModel from "./models/User.js";

mongoose
  .connect(
    "mongodb+srv://hlebharshkou:Kakerik2002@cluster0.pr0aq05.mongodb.net/Lucky"
  )
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => {
    console.log("DB error", err);
  });

const app = express();

app.use(express.json()); //Позволяет читать json в запросах

app.post("/auth/register", async (req, res) => {
  try {
    console.log("Пользователь который зарегестрировался: ", req.body.fullName);

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: '60d'
      }
    );

    res.json(...user, token);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось зарегестрироваться",
    });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
