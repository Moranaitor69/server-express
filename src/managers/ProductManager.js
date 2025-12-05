import ProductModel from "../models/ProductModel.js";

export default class ProductManager {

    async getProducts(queryParams = {}) {

        const {
            limit = 10,
            page = 1,
            sort,
            query
        } = queryParams;

        const filter = {};

        if (query) {
            // Buscar por categoría o disponibilidad (status)
            filter.$or = [
                { category: query },
                { status: query.toLowerCase() === "true" }
            ];
        }

        const options = {
            limit,
            page,
            lean: true
        };

        if (sort === "asc") options.sort = { price: 1 };
        if (sort === "desc") options.sort = { price: -1 };

        const result = await ProductModel.paginate(filter, options);

        return {
            status: "success",
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?page=${result.prevPage}` : null,
            nextLink: result.hasNextPage ? `/api/products?page=${result.nextPage}` : null
        };
    }

    async getProductById(id) {
        return await ProductModel.findById(id);
    }

    async addProduct(data) {
        return await ProductModel.create(data);
    }

    async updateProduct(id, updates) {
        return await ProductModel.findByIdAndUpdate(id, updates, { new: true });
    }

    async deleteProduct(id) {
        return await ProductModel.findByIdAndDelete(id);
    }
}
