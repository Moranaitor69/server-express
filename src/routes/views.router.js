// src/routes/views.router.js
import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager();

// Vista Home (productos normales)
router.get("/home", async (req, res) => {
    const products = await pm.getProducts();
    res.render("home", { products });
});

// Vista RealTimeProducts (con WebSockets)
router.get("/realtimeproducts", async (req, res) => {
    const products = await pm.getProducts();
    res.render("realTimeProducts", { products });
});

export default router;
