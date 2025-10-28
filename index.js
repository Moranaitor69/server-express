import express from "express"
import { promises as fs } from "fs"


const servidor = express()
const puerto = 8080

servidor.use(express.json())
servidor.use(express.urlencoded({ extended: true }))



class ProductManager {
    constructor(filePath) {
        this.filePath = filePath
    }

 
    async getProducts() {
        try {
            const data = await fs.readFile(this.filePath, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }

  
    async addProduct(productData) {
        const products = await this.getProducts()
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1

        const newProduct = {
            id: newId,
            title: productData.title,
            description: productData.description,
            code: productData.code,
            price: productData.price,
            status: true,
            stock: productData.stock,
            category: productData.category,
            thumbnails: productData.thumbnails || []
        }

        products.push(newProduct)
        await fs.writeFile(this.filePath, JSON.stringify(products, null, 2))
        return newProduct
    }
}


class CartManager {
    constructor(filePath) {
        this.filePath = filePath
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filePath, "utf-8")
            return JSON.parse(data)
        } catch (error) {
            return []
        }
    }

    async createCart() {
        const carts = await this.getCarts()
        const newId = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1
        const newCart = { id: newId, products: [] }
        carts.push(newCart)
        await fs.writeFile(this.filePath, JSON.stringify(carts, null, 2))
        return newCart
    }
}


const productManager = new ProductManager("./products.json")
const cartManager = new CartManager("./carts.json")


servidor.get("/", async (req, res) => {
    res.send("Servidor activo Usa /api/products o /api/carts")
})


servidor.get("/api/products", async (req, res) => {
    const products = await productManager.getProducts()
    res.json(products)
})


servidor.post("/api/products", async (req, res) => {
    const productData = req.body

  
    if (!productData.title || !productData.price) {
        return res.status(400).json({ error: "Faltan campos obligatorios (title, price)" })
    }

    const newProduct = await productManager.addProduct(productData)
    res.status(201).json(newProduct)
})



servidor.post("/api/carts", async (req, res) => {
    const newCart = await cartManager.createCart()
    res.status(201).json(newCart)
})

servidor.listen(puerto, () => {
    console.log(`Servidor corriendo en el puerto ${puerto}`)
})
