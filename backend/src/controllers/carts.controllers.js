import cartModel from "../daos/mongodb/models/cart.model.js";
import { cartServices } from "../services/cart.service.js";

export class CartControllers { 
    constructor() {
        this.getCart = this.getCart.bind(this);
        this.createCart = this.createCart.bind(this);
        this.insiderProductCart = this.insiderProductCart.bind(this);
        this.updateProductsCart = this.updateProductsCart.bind(this);
        this.updateQuantityProductCart = this.updateQuantityProductCart.bind(this);
        this.deleteProductCart = this.deleteProductCart.bind(this);
        this.deleteCart = this.deleteCart.bind(this);
    }
    getCart = async (req, res, next) => {
        try {
            const cartId = req.params.cid
            const cart = await cartServices.getCartById(cartId);
            if(!cart) {
                return res.status(400).json({ message: "Carrito no encontrado"});
            }
            res.status(200).send(cart)
        } catch(error) {
            next(error);
        };
    };
    
    createCart = async (req, res, next) => {
        try {
            const userId = req.user._id;
            const respuesta = await cartServices.createCart({userId, products: []});
            res.status(201).send(respuesta)
        } catch(error) {
            next(error)
        };
    };
    
    insiderProductCart = async (req, res, next) => {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid
            const {quantity} = req.body
            const cart = await cartModel.findById(cartId)
            const indice = cart.products.findIndex(prod => prod.id_prod._id == productId)
            if(cart) {
                if(indice != -1) {
                    cart.products[indice].quantity = quantity
                } else {
                    cart.products.push({id_prod: productId, quantity: quantity})
                }
                const mensaje = await cartModel.findByIdAndUpdate(cartId, cart)
                res.status(200).send(mensaje)
            } else {
                res.status(404).send("El carrito no existe")
            }
        } catch(error) {
            next(error);
        };
    };
    
    updateProductsCart = async (req, res, next) => {
        try {
            const cartId = req.params.cid
            const { products, userId } = req.body
            const cart = await cartModel.findOne({ _id: cartId })
            if(products) cart.products = products;
            if(userId) cart.userId = userId;
           await cart.save();
           res.status(200).send(cart)
        } catch(error) {
            console.log("ERROR EN updateProductsCart: ", error);
            
            next(error)
        }
    };
    
    updateQuantityProductCart = async (req, res, next) => {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid
            const {quantity} = req.body
            const cart = await cartModel.findOne({_id: cartId})
            const indice = cart.products.findIndex(prod => prod.id_prod._id == productId) 
            if(indice != -1) { 
                cart.products[indice].quantity = quantity;
                await cart.save();
                return res.status(200).json(cart);
            } else {
                res.status(404).send("producto no existe")
            };
        } catch(error) {
            next(error);
        };
    };

    purchaseCart = async(req, res, next) => {
      try {
            const { cid, userId } = req.params;                        
            const result = await cartServices.purchaseCart(cid, userId);
            res.status(200).json({ message: "Compra completada", result})
        } catch(error) {          
            next(error);
        }; 
    };
    
    deleteProductCart = async (req, res, next) => {
        try {
            const cartId = req.params.cid
            const productId = req.params.pid
            const cart = await cartModel.findOne({_id: cartId})
            const indice = cart.products.findIndex(prod => prod.id_prod._id == productId)
            if(indice != -1) {
                cart.products.splice(indice, 1)
                cart.save()
                res.status(200).send(cart)
            } else {
                res.status(404).send("Producto no existe");
            };
        } catch(error) {
            next(error)
        }
    };
    
    deleteCart = async (req, res, next) => {
        try {
            const cartId = req.params.cid
            const cart = await cartModel.findOne({_id: cartId})
            cart.products = []
            cart.save()
            res.status(200).send(cart)
        } catch(error) {
            next(error);
        };
    };
};