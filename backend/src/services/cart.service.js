import { cartRepository } from "../repository/cart.repository.js";
import { ticketService } from "./ticket.service.js";
import { productService } from "./product.service.js";
import { v4 as uuidv4 } from "uuid";
import cartModel from "../daos/mongodb/models/cart.model.js";
import { sendGmail } from "./email.service.js";
import TicketResDto from "../dtos/ticket.res.dto.js";

class CartServices {
    constructor() {
        this.cartRepository = cartRepository; 
    }

    createCart = async(data) => {
        try {
            const { userId } = data            
            const newCart = await cartRepository.createCart(data);           
            return newCart;
        } catch(error) {            
            throw new Error("Error al crear el carrito" + error.message);            
        };
    };

    addProdToCart = async(cartId, prodId) => {
        try {
            return await cartRepository.addProductToCart(cartId, prodId);
        } catch(error) {
            throw error            
        }
    };

    removeProdToCart = async(cartId, prodId) => {
        try {
            return await cartRepository.removeProdToCart(cartId, prodId);
        } catch(error) {
            throw error            
        }
    };

    upDateProdQuantityToCart = async(cartId, prodId, quantity) => {
        try {
            return await cartRepository.upDateProdQuantityToCart(cartId, prodId, quantity);
        } catch(error) {
            throw error            
        }
    };

    getCartById = async(cartId) => {
        try {
            const cart = await cartModel.findOne({_id: cartId}).populate("products.id_prod");
            if(!cart) {
                return res.status(400).json({ message: "Carrito no encontrado"});
            }
            return await cartRepository.getCartById(cartId)
        } catch(error) {
            throw new Error(error);
        };
    }

    calculateTotalAmount = (products) => {
        return products.reduce((total, item) => {
            if(!item.price) {
                console.error("Producto sin precio:", item);
            };

            return total + (item.quantity * item.price || 0);
        }, 0)
    };

    purchaseCart = async(cartId) => {
        try {
            const cart = await cartRepository.getCartById(cartId);
        if(!cart) {
            throw new Error(`No se encontro el carrito con ID ${cartId}`);
        };
        if(!cart.products || !Array.isArray(cart.products)) {
            throw new Error(`El carrito con ID ${cartId} no tiene productos`);
            
        };

        if(!cart.userId || !cart.userId.email) {
            throw new Error("El carrito no tiene un usuario válido")
        };

        let productsToPurchase = [];
        let productsOutStock = [];

        for(const item of cart.products) {
            const product = await productService.getById(item.id_prod);

            if(!product || product.stock < item.quantity) {
                productsOutStock.push(item);
            } else {
                product.stock -= item.quantity;
                await productService.updateProductStock(product.id, product.stock);
                productsToPurchase.push(item)
            };
        };

        if(productsToPurchase.length === 0) {
            throw new Error("No hay productos disponibles para comprar");
        };

        const ticketData = {
            code: uuidv4(),
            purchaser: cart.userId.email,
            amount: this.calculateTotalAmount(productsToPurchase),
            products: productsToPurchase.map(item => item.id_prod)
        };        

        const rawTicket = await ticketService.createTicket(ticketData);
        const ticket = await new TicketResDto(rawTicket);
        await sendGmail(ticket, cart.userId.email, productsToPurchase);

        const productosRestantes = cart.products.filter(item => !productsOutStock.find(out => out.id_prod === item.id_prod));
        await cartRepository.update(cart._id, { products: productosRestantes})

        return {ticket, productsOutStock};
        } catch(error) {                    
            throw new Error("Error al procesar la compra en el carrito: " + error.message);            
        };
    };

    clearCart = async(cartId) => {
        try {
            return await cartRepository.clearCart(cartId);
        } catch(error) {
            throw error            
        }
    };
};

export const cartServices = new CartServices();