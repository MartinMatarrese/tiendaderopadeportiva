import { productRepository } from "../repository/product.repository.js";

class ProductService {
    constructor() {
        this.productRepository = productRepository
    };

    getAll = async() => {
        try {
            return await productRepository.getAll();
        } catch (error) {
            throw new Error(error);            
        };
    };

    create = async(product) => {
        try {
            return await productRepository.create(product);
        } catch (error) {
            throw new Error(error);
        };
    };

    getById = async(id) => {
        try {
            const prod = await productRepository.getById(id);
            if(!prod) {
                throw new Error(`No se encontro el producto con el id: ${id}`);
                
            }
            return prod
        } catch(error) {
            throw Error(error);
        };
    };

    getByCategory = async(category) => {
        try {
            return await productRepository.getByCategory(category);
        } catch (error) {
            throw new Error(error);            
        };
    };

    update = async(id, data) => {
        return await productRepository.update(id, data);
    };

    updateProductStock = async(id, newStock) => {
        try {
            const response = await productRepository.updateProductStock(id, newStock);
            return response;
        } catch(error) {
            throw new Error(error);
        };
    };

    delete = async(id) => {
        try {
            const product = await productRepository.delete(id);
            return product
        } catch (error) {
            throw new Error(error);
        };
    };
};

export const productService = new ProductService();