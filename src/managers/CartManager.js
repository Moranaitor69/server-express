import { promises as fs } from "fs";
import path from "path";

export default class CartManager {
  constructor(filename = "carts.json") {
    this.filePath = path.resolve("src", "data", filename);
  }

  async getCarts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    return carts.find(c => c.id === Number(id)) || null;
  }

  async createCart() {
    const carts = await this.getCarts();
    const newId = carts.length ? carts[carts.length - 1].id + 1 : 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return newCart;
  }

  
  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex(c => c.id === Number(cartId));
    if (cartIndex === -1) return null;

    const cart = carts[cartIndex];

    const existing = cart.products.find(p => p.product === Number(productId));
    if (existing) {
      existing.quantity = Number(existing.quantity) + 1;
    } else {
      cart.products.push({ product: Number(productId), quantity: 1 });
    }

    carts[cartIndex] = cart;
    await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2));
    return cart;
  }
}
