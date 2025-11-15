// src/index.js
import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servidor = express();
const puerto = 8080;

// Middleware
servidor.use(express.json());
servidor.use(express.urlencoded({ extended: true }));

// Configurar las Handlebars
servidor.engine("handlebars", engine());
servidor.set("view engine", "handlebars");
servidor.set("views", path.join(__dirname, "views"));

// Rutas con una API
servidor.use("/api/products", productsRouter);
servidor.use("/api/carts", cartsRouter);

// Rutas de las vistas
servidor.use("/", viewsRouter);

// Servidor HTTP con el WebSocket
const httpServer = servidor.listen(puerto, () => {
  console.log(`Servidor corriendo en el puerto ${puerto}`);
});

export const io = new Server(httpServer);
