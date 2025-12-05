// src/routes/products.router.js
import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { io } from "../index.js";

const router = Router();
const pm = new ProductManager();

// GET CON PAGINADO + QUERY + SORT
router.get("/", async (req, res) => {
    try {
        const result = await pm.getProducts(req.query);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET PRODUCTO POR ID
router.get("/:pid", async (req, res) => {
    const product = await pm.getProductById(req.params.pid);

    if (!product) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
});

// CREATE PRODUCT
router.post("/", async (req, res) => {
    try {
        const created = await pm.addProduct(req.body);

        io.emit("updateProducts", await pm.getProducts());

        res.status(201).json(created);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// UPDATE PRODUCT
router.put("/:pid", async (req, res) => {
    try {
        const updated = await pm.updateProduct(req.params.pid, req.body);

        if (!updated) {
            return res.status(404).json({ error: "Producto no encontrado" });
        }

        res.json(updated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE PRODUCT
router.delete("/:pid", async (req, res) => {
    const deleted = await pm.deleteProduct(req.params.pid);

    if (!deleted) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    io.emit("updateProducts", await pm.getProducts());

    res.json({ message: "Producto eliminado" });
});

export default router;
