import express from "express";
import mongoose from "mongoose";

import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controllers/UserController.js";

import * as UserController from './controllers/UserController.js'
import * as ProductController from './controllers/ProductController.js'

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


//Запросы
app.post("/auth/login", UserController.login);
app.post("/auth/register", UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe)

//Product
app.get('/products', ProductController.getAll);
app.get('/products/:id', ProductController.getOne);
app.post('/products', checkAuth, ProductController.create);
app.delete('/products/:id', checkAuth, ProductController.remove);
app.patch('/products/:id', checkAuth, ProductController.update);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
