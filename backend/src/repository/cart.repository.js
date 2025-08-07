import persistence from "../daos/persistence.js";
import CartReqDto from "../dtos/cart.req.dto.js";
import CartResDto from "../dtos/cart.res.dto.js";

const { cartDao } = persistence

class CartRepository {
    constructor(){
        this.dao = cartDao
    };

    createCart = async(cartData) => {
        try {
            const response = new CartReqDto(cartData);
            const cart = await this.dao.create(response);
            return cart
        } catch(error) {
            throw new Error(`Error en cartRepository al crear el carrito: ${error.message}`);
        };
    };

    addProductToCart =async (cartId, productId, quantity) => {
        try {
            const cartDao = new CartReqDto(cartId, productId, quantity);
            return await this.dao.addProductToCart(cartDao);
        } catch(error) {
            throw new Error(error)
        }
    };

    getCartById = async(id) => {
        try {
            if(!id) {
                throw new Error("ID del carrito no proporcionado");                 
            };
            const cart = await this.dao.getCartById(id);
            
            if(!cart) {
                return null;                
            };
            
            const response = new CartResDto(cart);
            return response
        } catch(error) {            
            throw new Error(error);
        };
    };

    update = async(cartId, updateData) => {
        try {
            const updateCart = await this.dao.update(cartId, updateData);
            return updateCart;
        } catch (error) {
            throw new Error("Error en cartRepository: " + error.message);
            
        }
    };
};

export const cartRepository = new CartRepository();