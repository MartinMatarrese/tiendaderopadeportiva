import fs from "fs";
import { v4 as uuidv4 } from "uuid";

class CartDaoFs {
    constructor(path) {
        this.path = path
    };

    getAllCarts = async() => {
        try {
            if(fs.existsSync(this.path)) {
                const carts = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(carts);
            };
            return [];
        } catch (error) {
            throw new Error(error);            
        };
    };

    getCart = async(cartId) => {
        try {
            const carts = await this.getAllCarts();
            return carts.find(cart => cart.id === cartId) || null
        } catch (error) {
            throw new Error(error);            
        };
    };

    createCart = async() => {
        try {
            const carts = await this.getAll();
            const newCart = {
                id: uuidv4(),
                products: [],
            };
            carts.push(newCart);
        } catch (error) {
            throw new Error(error);            
        };
    };

    insiderProductCart = async(cartId, productId, quantity) => {
        try {
            const carts = this.getAll();
            const cartIndex = carts.findeIndex(cart => cart.id === cartId);
            if(cartIndex === -1) throw new Error("El carrito no existe");
            const cart = carts[cartIndex];
            const productIndex = cart.products.findeIndex(prod => prod.id_prod === productId);
            if(productIndex !== -1) {
                carts.products[productIndex].quantity = quantity;
            } else {
                cart.products.push({ id_prod: productId, quantity });
            };
            carts[cartIndex] = cart
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            return cart
        } catch (error) {
            throw new Error(error);            
        };
    };

    updateProductsCart = async(cartId, newProducts) => {
        try {
            const carts = await this.getAllCarts();
            const cartIndex = carts.findeIndex(cart => cart.id === cartId);
            if(cartIndex === -1) throw new Error("El carrito no existe");
            carts[cartIndex].products == newProducts;
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            return carts[cartIndex];
        } catch (error) {
            throw new Error(error);
        };
    };

    updateQuantityProductsCart = async(cartId, productId, quantity) => {
        try{
            const carts = await this.getAllCarts();
            const cartIndex = carts.findeIndex(cart => cart.id === cartId);
            if(cartIndex === -1) throw new Error("El carrito no existe");
            const cart = carts[cartIndex];
            const productIndex = cart.product.findeIndex(prod => prod.id_prod === productId);
            if(productIndex !== -1) {
                cart.products[productIndex].quantity = quantity;
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
                return cart
            } else {
                throw new Error("El producto no existe en el carrito");            
            };
        } catch(error) {
            throw new Error(error);
        };
    };

    deleteProductCart = async(cartId, productId) => {
        try {
            const carts = await this.getAllCarts();
            const cartIndex = carts.findeIndex(cart => cart.id === cartId);
            if(cartIndex === -1) throw new Error("El carrito no existe");
            const cart = carts[cartIndex];
            const productIndex = cart.products.findeIndex(prod => prod.id_prod === productId);
            if(productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
                return cart
            } else {
                throw new Error("El producto no existe en el carrito");                
            };
            
        } catch (error) {
            throw new Error(error);            
        };
    };

    deleteCart = async(cartId) => {
        try {
            const carts = await this.getAllCarts();
            const cartindex = carts.findeIndex(cart => cart.id === cartId);
            if(cartindex === -1) throw new Error("El carrito no existe");
            carts[cartindex].products = [];
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
            return carts[cartindex];            
        } catch(error) {
            throw new Error(error);            
        };
    };
};

export const cartDao = new CartDaoFs("./src/carts.json");