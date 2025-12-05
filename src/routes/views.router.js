import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const pm = new ProductManager();

// Ruta raíz → redirige a /home
router.get("/", (req, res) => {
    res.redirect("/home");
});

// Vista Home
router.get("/home", async (req, res) => {
    const products = await pm.getProducts();
    res.render("home", { 
        products,
        isHome: true      //activa el link HOME
    });
});

// Vista Real-Time con WebSocket
router.get("/realtimeproducts", async (req, res) => {
    const products = await pm.getProducts();
    res.render("realTimeProducts", { 
        products,
        isRealtime: true  // activa el link REALTIME
    });
});

export default router;
