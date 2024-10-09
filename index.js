import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http"


import checkAuth from "./utils/checkAuth.js";
import { getMe, login, register } from "./controllers/UserController.js";

import { UserController, ProductController, SaleController, AdminController, ProviderController, SupplyController, ShopInfoController, OrderController } from './controllers/index.js'

import { WebSocketServer } from "ws";


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

//webSocket
const server = http.createServer(app);
const webSocketServer = new WebSocketServer({ port: 8080 })

webSocketServer.on('connection', ws => {
  ws.on('message', message => {
    message = JSON.parse(message)
    switch (message.event) {
      case 'message':
        broadcastMessage(message)
        break;
      case 'connection':
        broadcastMessage(message)
        break;
    }
  })
  ws.on('error', e => ws.send(e))
})


function broadcastMessage(message) {
  webSocketServer.clients.forEach(client => client.send(JSON.stringify(message)))
}


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

//Orders
app.post('/orders', OrderController.create);
app.get('/orders', OrderController.getAll);
app.get('/orders/:id', OrderController.getOne);
app.get('/orders/user/:id', OrderController.getMyOrders);
app.post('/orders/ready', OrderController.ready);
app.post('/orders/approve', OrderController.approveOrder);


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

//Shop Info
app.post('/content', ShopInfoController.create)
app.get('/content', ShopInfoController.getAll)

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log("Server OK");
});
