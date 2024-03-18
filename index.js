import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controllers/UserController.js";

import {UserController, ProductController, SaleController, AdminController, ProviderController, SupplyController} from './controllers/index.js'


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

app.use(cors())
app.use(express.json()); //Позволяет читать json в запросах


//Запросы
app.post("/auth/login", UserController.login);
app.post("/auth/register", UserController.register);
app.get("/auth/me", checkAuth, UserController.getMe)

//Товары на сайте
app.get('/products', ProductController.getAll);
app.get('/products/:id', ProductController.getOne);
app.get('/products/most/popular', ProductController.getMostPopular);
app.get('/products/most/new', ProductController.getNewProducts);
app.post('/products', checkAuth, ProductController.create);
app.post('/products/sale', ProductController.approveSale);
app.delete('/products/:id', checkAuth, ProductController.remove);
app.patch('/products/:id', checkAuth, ProductController.update);
app.post('/products/report', checkAuth, ProductController.exportReport)

//Sale
app.post('/sales', checkAuth, SaleController.create);
app.get('/sales', SaleController.getAll);


//Admin
app.post('/admin/auth/login', AdminController.login)
app.get("/admin/auth/me", checkAuth, AdminController.getMe)

//Управление пользователями
app.get("/users", UserController.getAll)
app.delete("/users/:id", UserController.remove)

//Поставщики
app.get('/providers', ProviderController.getAll)
app.post('/providers', ProviderController.create)

//Поставки
app.get('/supplies', SupplyController.getAll)
app.get('/supplies/:id', SupplyController.getOne)
app.post('/supplies', SupplyController.create)
app.patch('/supplies', SupplyController.approveOne)


app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
