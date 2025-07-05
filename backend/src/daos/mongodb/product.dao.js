import productModel from "./models/product.model.js";
import MongoDao from "./mongo.dao.js";

class ProductDaoMongo extends MongoDao {
    constructor() {
        super(productModel)
    };

    getByCategory = async(category) => {
        try {
            return await this.model.find({ category: category });
        } catch(error) {
            throw new Error(`Error al buscar los productos por categoria: ${error}`);
        }
    };
};

export const prodDao = new ProductDaoMongo();