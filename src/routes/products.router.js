import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";
import { io } from "../index.js";

const router = Router();
const pm = new ProductManager();





// GET /api/products
router.get("/", async (req, res) => {
  const products = await pm.getProducts();
  res.json(products);
});

// GET /api/products/:pid
router.get("/:pid", async (req, res) => {
  const product = await pm.getProductById(req.params.pid);
  if (!product)
    return res.status(404).json({ error: "Producto no encontrado" });
  res.json(product);
});

// POST /api/products (CREAR PRODUCTO)
router.post("/", async (req, res) => {
  try {
    const created = await pm.addProduct(req.body);

    const products = await pm.getProducts();
    io.emit("updateProducts", products);

    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  try {
    const updated = await pm.updateProduct(req.params.pid, req.body);
    if (!updated)
      return res.status(404).json({ error: "Producto no encontrado" });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  const ok = await pm.deleteProduct(req.params.pid);
  if (!ok)
    return res.status(404).json({ error: "Producto no encontrado" });


  const products = await pm.getProducts();
  io.emit("updateProducts", products);

  res.json({ message: "Producto eliminado" });
});

export default router;
