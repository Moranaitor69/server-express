// src/index.js
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import usersRouter from "./routes/users.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servidor = express();
const puerto = 8080;

// Middlewares
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));
servidor.use(express.static(path.join(__dirname, "public")));

// Handlebars
servidor.engine("handlebars", engine({
  partialsDir: path.join(__dirname, "views", "partials")
}));
servidor.set("view engine", "handlebars");
servidor.set("views", path.join(__dirname, "views"));

// Rutas API
servidor.use("/api/products", productsRouter);
servidor.use("/api/carts", cartsRouter);

// Rutas Vistas
servidor.use("/", viewsRouter);

// Rutas Users (IMPORTANTE)
servidor.use("/users", usersRouter);

// MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/demo-db-1")
.then(() => console.log("MongoDB conectado"))
.catch(error => console.log("Error MongoDB:", error));

// Servidor
const httpServer = servidor.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
});

// Websocket
export const io = new Server(httpServer);

import ProductManager from "./managers/ProductManager.js";
const pm = new ProductManager();

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  const products = await pm.getProducts();
  socket.emit("updateProducts", products);

  socket.on("newProduct", async (data) => {
    await pm.addProduct(data);
    const updatedProducts = await pm.getProducts();
    io.emit("updateProducts", updatedProducts);
  });
});
