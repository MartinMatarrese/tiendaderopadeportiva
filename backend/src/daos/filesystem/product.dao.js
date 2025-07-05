import fs from "fs";
import { v4 as uuidv4 } from "uuid";

class ProductDaoFs {
    constructor(path) {
        this.path = path
    };

    getAll = async() => {
        try {
            if(fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(products);
            };
            return [];
        } catch(error) {
            throw new Error(error);
        };
    };

    create = async(obj) => {
        try {
            const product = {
                id: uuidv4(),
                ...obj
            };
            const products = await this.getAll();
            const productExist = await this.getById(product.id);
            if(productExist) throw new Error("El producto ya existe");
            products.push(product);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            return product;
        } catch(error) {
            throw new Error(error)
        };
    };

    getById = async(id) => {
        try {
            const products = await this.getAll();
            const product = products.find((product) => product.id === id);
            if(!product) return null
        } catch(error) {
            throw Error(error)
        };
    };
};

export const prodDao = new ProductDaoFs("/src/products.json");