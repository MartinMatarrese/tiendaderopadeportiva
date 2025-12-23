import { cartRepository } from "../repository/cart.repository.js";
import { ticketService } from "./ticket.service.js";
import { productService } from "./product.service.js";
import { v4 as uuidv4 } from "uuid";
import cartModel from "../daos/mongodb/models/cart.model.js";
import { sendGmail } from "./email.service.js";
import TicketResDto from "../dtos/ticket.res.dto.js";
import { userService } from "./user.service.js";

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
            console.log("Iniciando purchaseCart para cartId:", cartId);
            
            const cart = await cartRepository.getCartById(cartId);

            console.log("Carrito obtenido:", {
                id: cart._id, 
                userId: cart.userId,
                tipoUserId: typeof cart.userId,
                esObjeto: typeof cart.userId === "object",
                tieneEmail: cart.userId?.email ? "SI" : "NO",
                productsCount: cart.products?.length
            });
            

        if(!cart) {
            throw new Error(`No se encontro el carrito con ID ${cartId}`);
        };

        if(!cart.products || !Array.isArray(cart.products)) {
            throw new Error(`El carrito con ID ${cartId} no tiene productos`);
            
        };

        // if(!cart.userId || !cart.userId.email) {
        //     throw new Error("El carrito no tiene un usuario válido")
        // };

        let userEmail = null;
        let userId = null;

        console.log("DEBUG usuario en carrito:", {
            userId: cart.userId,
            esString: typeof cart.userId === "string",
            esObjeto: typeof cart.userId === "object",
            tieneEmailProp: typeof cart.userId?.email ? "SI" : "NO" 
        });
        

        if(cart.userId && typeof cart.userId === "object" && cart.userId.email) {
            userEmail = cart.userId.email;
            userId = cart.userId._id || cart.userId.id;
            console.log("Usuario obtenido del carrito populado:", { email: userEmail, id: userId});            
        } else if(cart.userId) {
            console.log("userId es string, buscando usuario con ID:", cart.userId);
            
            try {
                const user = await userService.getUserById(cart.userId)
                if(user && user.email) {
                    userEmail = user.email;
                    userId = user._id || user.id;
                    console.log("Usuario obtenido por ID:", { email: userEmail, id: userId});                    
                } else {
                    console.error("Usuario encontrado pero sin email:", user);                   
                    
                };
            } catch (error) {
                console.error("Error obteniendo usuario por ID:", error);
            };
        } else if(cart.userId && cart.userId._id) {
            console.log("userId es ObjectId objeto, buscando usuario con ID:", cart.userId._id);
            try {
                const user = await userService.getUserById(cart.userId._id.toString());
                if(user && user.email) {
                    userEmail = user.email;
                    userId = user._id || user.id;
                    console.log("Usuario obtenido por ObjectId:", { email: userEmail, id: userId });
                    
                }
            } catch (error) {
                console.error("Error obteniendo usuario:", error.message);                
            }            
        }

        if(!userEmail) {
            console.error("No se pudo obtener email del usuario:", {
                cartId: cart._id,
                userId: cart.userId,
                typo: typeof cart.userId
            });
            
            throw new Error("No se pudo obtener el email del usuario para la compra");
            
        }

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

        // const ticketData = {
        //     code: uuidv4(),
        //     purchaser: cart.userId.email,
        //     amount: this.calculateTotalAmount(productsToPurchase),
        //     products: productsToPurchase.map(item => item.id_prod)
        // };
        const ticketData = {
            code: uuidv4(),
            purchaser: userEmail,
            amount: this.calculateTotalAmount(productsToPurchase),
            products: productsToPurchase.map(item => item.id_prod)
        };

        const rawTicket = await ticketService.createTicket(ticketData);
        const ticket = await new TicketResDto(rawTicket);
        console.log("Intentando enviar email a:", userEmail);
        
        try {
            const productForEmail = [];

            for(const item of productsToPurchase) {
                try {
                    const product = await productService.getById(item.id_prod);
                    if(product) {
                        productForEmail.push({
                            title: product.title || product.name || `Producto ${item.id_prod}`,
                            quantity: item.quantity || 1,
                            precio: product.price || 0,
                        });
                    } else {
                        console.warn(`Producto ${item.id_prod} No encontrado por email`);
                        productForEmail.push({
                            title: `Producto ${item.id_prod}`,
                            quantity: item.quantity || 1,
                            price: 0
                        });          
                    };   
                } catch (error) {
                    console.error(`Error obteniendo producto ${item.id_prod}:`, error.message);
                    throw new Error(`Error obteniendo producto ${item.id_prod}:`, error.message);
                      
                };
            };

            console.log("Productos para email: ", productWithDetails.length);

            // await sendGmail(ticket, cart.userId.email, productsToPurchase);
            console.log("=== DEBUG SENDGMAIL ===");
            console.log("Datos para sendGmail:", {
                ticketCode: ticket.code,
                userEmail: userEmail,
                productsCount: productForEmail.length,
                firstProduct: productForEmail[0]
            });
            
            console.log("1. Ticket:", {
                code: ticket?.code,
                amount: ticket?.amount,
                purchaser: ticket?.purchaser,
                _id: ticket?._id
            });

            console.log("2. userEmail:", userEmail);
            console.log("3. Tipo de userEmail:", typeof userEmail);
            console.log("4. Es string email?", typeof userEmail === 'string' && userEmail.includes('@'));

            console.log("5. productsToPurchase:", {
                length: productsToPurchase?.length,
                firstItem: productsToPurchase?.[0],
                items: productsToPurchase?.map(p => ({
                    id_prod: p.id_prod,
                    quantity: p.quantity
                }))
            });

            console.log("6. ¿sendGmail function existe?", typeof sendGmail);
            console.log("=== FIN DEBUG ===");

            await sendGmail({
                ticket,
                userEmail,
                productForEmail
            });

            console.log(`Email enviado exitosamente a ${userEmail}`);            
        } catch (error) {
            console.error("Error enviando email (no falla la compra):", {
                message: error.message,
                stack: error.stack,
                userEmail: userEmail,
                
            });
            throw new Error("Error enviando email (no falla la compra):", error.message);
            
        }

        const productosRestantes = cart.products.filter(item => !productsOutStock.find(out => out.id_prod === item.id_prod));
        await cartRepository.update(cart._id, { products: productosRestantes})
        console.log("purchaseCart completado exitosamente");        

        return {ticket, productsOutStock, userEmail, userId};
        
        } catch(error) {
            console.error("Error en purchaseCart:", error.message);
            console.error("Stack trace:", error.stack);

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