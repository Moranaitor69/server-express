import { Router } from "express";
import CartManager from "../managers/CartManager.js";
import ProductManager from "../managers/ProductManager.js";

const router = Router();

// Los managers ya saben dónde están los JSON
const cm = new CartManager();
const pm = new ProductManager();

// Crear carrito
router.post("/", async (req, res) => {
  const cart = await cm.createCart();
  res.status(201).json(cart);
});

// Obtener productos de un carrito
router.get("/:cid", async (req, res) => {
  const cart = await cm.getCartById(req.params.cid);
  if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
  res.json(cart.products);
});

// Agregar producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  const product = await pm.getProductById(pid);
  if (!product) return res.status(404).json({ error: "Producto no encontrado" });

  const updated = await cm.addProductToCart(cid, pid);
  if (!updated) return res.status(404).json({ error: "Carrito no encontrado" });

  res.json(updated);
});

export default router;
