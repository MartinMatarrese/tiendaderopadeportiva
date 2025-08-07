import persistence from "../daos/persistence.js";
import ProductReqDto from "../dtos/product.req.dto.js";
import ProductResDto from "../dtos/product.res.dto.js";

const { prodDao } = persistence

class ProductRepository {
    constructor(){
        this.dao = prodDao
    }

    getAll = async() => {
        try {
            const products = await this.dao.getAll();
            return products.map(prod => new ProductResDto(prod));
        } catch(error) {
            throw new Error(error);            
        }
    }

    create = async(product) => {
        try {
            const prodDao = new ProductReqDto(product);
            return await this.dao.create(prodDao);
        } catch(error) {
            throw new Error(error);
        };
    };

    getById = async(id) => {
        try {
            const response = await this.dao.getById(id);            
            if(!response) {
                return null
            };
            return new ProductResDto(response)
        } catch(error) {
            throw new Error(error);
        };
    };

    getByCategory = async(category) => {
        try {
            const response = await this.dao.getByCategory(category);
            return response.map(product => new ProductResDto(product));
        } catch(error) {
            throw new Error(error);
        };
    };

    update = async(id, data) => {
        try {
            const updateProd = await this.dao.update(id, data, {new: true});
            return updateProd
        } catch (error) {
            throw new Error(error)
        }
    };

    updateProductStock = async(id, newStock) => {
        try {
            const response = await this.update(id, { stock: newStock });
            return response;
        } catch (error) {
            throw new Error(error);
        };
    };

    delete = async(id) => {
        try {
            const product = await this.dao.delete(id);
            return product
        } catch (error) {
            throw new Error(error);
        };
    };
};

export const productRepository = new ProductRepository();