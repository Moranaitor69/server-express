import { promises as fs } from "fs";
import path from "path";

export default class ProductManager {
  constructor(filename = "products.json") {
    this.filePath = path.resolve("src", "data", filename);
  }

  async getProducts() {
    try {
      const data = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === Number(id)) || null;
  }

  async addProduct(productData) {
   
    const required = ["title", "description", "code", "price", "stock", "category"];
    const missing = required.filter(f => productData[f] === undefined || productData[f] === null || productData[f] === "");

    if (missing.length) {
      throw new Error(`Faltan campos obligatorios: ${missing.join(", ")}`);
    }

    const products = await this.getProducts();


    if (products.some(p => p.code === productData.code)) {
      throw new Error(`El código '${productData.code}' ya existe`);
    }

    const newId = products.length ? products[products.length - 1].id + 1 : 1;
    const newProduct = {
      id: newId,
      title: productData.title,
      description: productData.description,
      code: productData.code,
      price: Number(productData.price),
      status: productData.status === undefined ? true : Boolean(productData.status),
      stock: Number(productData.stock),
      category: productData.category,
      thumbnails: Array.isArray(productData.thumbnails) ? productData.thumbnails : (productData.thumbnails ? [productData.thumbnails] : [])
    };

    products.push(newProduct);
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return newProduct;
  }

  async updateProduct(id, updates) {
    const products = await this.getProducts();
    const idx = products.findIndex(p => p.id === Number(id));
    if (idx === -1) return null;

    delete updates.id;

   
    if (updates.code && products.some((p, i) => p.code === updates.code && i !== idx)) {
      throw new Error("El código está en uso por otro producto");
    }

    const updated = { ...products[idx], ...updates };

    if (updated.price !== undefined) updated.price = Number(updated.price);
    if (updated.stock !== undefined) updated.stock = Number(updated.stock);
    updated.status = updated.status === undefined ? Boolean(products[idx].status) : Boolean(updated.status);

    products[idx] = updated;
    await fs.writeFile(this.filePath, JSON.stringify(products, null, 2));
    return updated;
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== Number(id));
    if (filtered.length === products.length) return false; // no existía
    await fs.writeFile(this.filePath, JSON.stringify(filtered, null, 2));
    return true;
  }
}
