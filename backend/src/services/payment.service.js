import { paymentRepository } from "../repository/payment.repository.js";
import axios from "axios";
import "dotenv/config";
import { paymentModel } from "../daos/mongodb/models/payment.model.js";
import { paymentDao } from "../daos/mongodb/payment.dao.js";
import { sendGmail } from "./email.service.js";
import { cartServices } from "./cart.service.js";
import mercadopago from "mercadopago";
import { error } from "console";
import { cartRepository } from "../repository/cart.repository.js";


const frontendUrl = process.env.FRONTEND_URL;
const frontendLocal = process.env.FRONTEND_LOCAL;
const tokenMp = process.env.ACCES_TOKEN_MP

class PaymentService {
    constructor() {
        this.paymentRepository = paymentRepository;
    };

    createPreference = async( { userId, cartId, cart, userEmail }) => {
        try {
            const env = process.env.NODE_ENV || "development"
            const isProduction = env === "production";
            const isTest = env === "test";
            const successUrl = isTest ? "https://example.com/success" : isProduction ? `${frontendUrl}#/payments/success` : `${frontendLocal}tiendaderopadeportiva/payments/success`;
            if(!cartId && cartId === "undefined") {
                throw new Error("cartId es inválido: " + cartId)
            }            
            const failureUrl = isTest ? "https://example.com/failure" : isProduction ? `${frontendUrl}#/payments/failure` : `${frontendLocal}tiendaderopadeportiva/payments/failure`;
            const pendingUrl = isTest ? "https://example.com/pending" : isProduction ? `${frontendUrl}#/payments/pending` : `${frontendLocal}tiendaderopadeportiva/payments/pending`;

            const items = cart.products.map(p => ({
                title: p.title || "producto",
                quantity: p.quantity || 1,
                unit_price: Number(p.price) || 0,
                currency_id: "ARS"
                    
            }));

            const invalidItems = items.filter(item => !item.unit_price || item.unit_price === 0);
            if(invalidItems.length > 0) {
                throw new Error(`Items sin precio Válido ${invalidItems.length}`);
                
            }

            const url = "https://api.mercadopago.com/checkout/preferences"
            const body = {
                payer_email: userEmail,
                items: items,
                payment_methods: {
                    installments: 1,
                    exclued_payments_methods: [],
                    exlued_payments_types: []
                },
                back_urls: {
                    success: successUrl,
                    failure: failureUrl,
                    pending: pendingUrl
                },
                external_reference: cartId,
                auto_return: "approved",
                metadata: {
                    userId: userId,
                    cartId: cartId,
                    userEmail: userEmail
                },
                notification_url: "https://tiendaderopadeportiva.onrender.com/api/payments/webhook"
            }

            const payment = await axios.post(url, body, {
                headers: {
                    "Conten-Type": "application/json",
                    Authorization: `Bearer ${tokenMp}`
                }
            });

            return payment.data
        } catch (error) {
             console.error("❌ Error en createPreference:", error);
            throw new Error("Error al crear la preferencia de pago: " + error.message);
        };
    };


    getPaymentFromMp = async(paymentId) => {
        try {
            console.log(`Obteniendo pago ${paymentId} desde la API de Mercado Pago...`);
            const url = `https://api.mercadopago.com/v1/payments/${paymentId}`
            const response = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${tokenMp}`
                }
            });
            console.log(`Pago ${paymentId} obtenido correctamente`);
            return response.data;
            
        } catch (error) {
            console.error(`Error obteniendo pago ${paymentId} de MP:`, error.message);
            if(error.response) {
                console.error("Detalles del error:", {
                    status: error.response.status,
                    data: error.response.data
                });
            };
            
            throw new Error(`Error al obtener el pago de MP: ${error.message}`);                        
        };
    };

    processApprovedPayment = async(payment, cartId) => {
        console.log(`Pago aprobado, procesando carrito ${cartId}`);
        
        try {
            // const cartId = payment.external_reference;
            // console.log(`Pago aprobado, procesando carrito: ${cartId}`);
            const cart = await cartRepository.getCartById(cartId);
            if(!cart || !cart.products || cart.products.length === 0) {
                console.warn("El carrito esta vacio o no existe");
                return {
                    userId: payment.metadata?.userId,
                    ticket: null,
                    userEmail: payment.payer?.email || payment.metadata?.userEmail,
                    warning: "Carrito vacio"
                };
            }
            console.log("Llamando a cartService.purchaseCart...");
            
            const resultado = await cartServices.purchaseCart(cartId);

            console.log(`Email enviado a: ${resultado.userEmail}`);
            console.log(`Ticket creado: ${resultado.ticket?.code}`);           
            console.log(`Guardando pago ${payment.id} en la BD...`);
            
            // await this.createPayment({
            //     payment_id: payment.id,
            //     status: payment.status,
            //     cartId: payment.cartId,
            //     userId: resultado.userId,
            //     amount: resultado.ticket.amount,
            //     ticketId: resultado.ticket._id,
            //     processedAt: new Date()
            // });
            await this.savePaymentToDatabase(payment, resultado.ticket?._id);

            console.log(`Pago ${payment.id} guardado en la BD correctamente`);

            return {
                userId: resultado.userId,
                ticket: resultado.ticket,
                userEmail: resultado.userEmail,
                productsOutStock: resultado.productsOutStock
            }
            
        } catch (error) {
            console.error(`Error al procesar el pago:`, error.message);
            throw new Error(`Error al procesar el pago: ${error.message}`);           
        }
    }

    getPaymentFromDatabase = async(paymentId) => {
        try {
            console.log(`Buscando pago ${paymentId} en la base de datos...`);
            const payment = await paymentModel.findOne({ payment_id: paymentId});

            if(payment) {
                console.log(`Pago encontrado en la BD: ${payment._id}`);
                return payment                
            } else {
                console.error(`No se encontró pago ${paymentId} en la BD`);
                return null;
            }
            
        } catch (error) {
            console.error("Error buscando pago en BD:", error.message);
            return null;
        };
    };

    getPaymentFromMp = async(paymentId) => {
        try {
            // console.log("Service: Buscando pago por payment_id:", paymentId);
            
            // return await this.paymentRepository.getPaymentById(paymentId);
            const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenMp}`
                }
            });

            return response.data;
        } catch (error) {
            console.error("Service: Error en getPaymentId:", error.message);
            
            throw new Error(`Error al obtener el pago por paymentId: ${error.message}`);
        };
    };

    webHook = async(notification) => {
        try {
            console.log("Notificación recibida en webHook:", notification);

            const { type, data } = notification;

            if(type !== "payment") {
                console.log(`webhook de tipo ${type} ignorado`);
                return { processed: false, reason: "Notificación no se pagó" }
            };

            const paymentId = data.id.toString();

            console.log(`Consultando pago ${paymentId}...`);

            const existingPayment = await this.getPaymentFromDatabase(paymentId);
            if(existingPayment) {
                console.log(`Pago ${paymentId} ya procesado`);
                return { processed: false, reason: "Pago duplicado" };                
            };

            const payment = await this.getPaymentFromMp(paymentId);

            if(!payment) {
                throw new Error("No se recibieron datos del pago");                
            };

            if(payment.status !== "approved") {
                console.log(`Pago ${paymentId} no aprobado ${payment.status}`);
                
                return { process: false, data: `Pago no aprobado ${payment.status}`};
            };

            let cartId = payment.external_reference;
            if(!cartId && payment.metadata) {
                cartId = payment.metadata.cartId || payment.metadata.cart_id;
                console.log(`CartId encontrado en metadata: ${cartId}`);                
            };

            if(!cartId) {
                console.error("No se pudo entontrar cartId");
                console.log("Payment completo:", JSON.stringify(payment, null, 2));
                const userId = payment.metadata?.userId || payment.payer?.id;
                if(userId) {
                    console.log(`Buscando carrito activo para userId: ${userId}`);
                    const cart = await cartRepository.findActiveCartByUserId(userId);
                    if(cart) {
                        cartId = cart._id.toString();
                        console.log(`Carrito encontrado por userId: ${cartId}`);                        
                    };
                };

                if(!cartId) {
                    return {
                        processed: false,
                        reason: "No se encontró cartId - Se procesara con merchant_order",
                        paymentId: paymentId
                    };                
                };
            };
            console.log(`Pago obtenido: ${payment.status}, Carrito: ${cartId}`);
            
            const resultado = await this.processApprovedPayment(payment, cartId)

            return { processed: true, data: resultado };

        } catch (error) {
            console.error("Error en webHook:", error.message);
            throw new Error(error);           
            
        };
    };

    getMerchantOrder = async(orderId) => {
        try {
            console.log(`Obteniendo marchant_order ${orderId} de Mercado Pago...`);
            const url = `https://api.mercadopago.com/merchant_orders/${orderId}`;
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${tokenMp}`
                }
            });
            console.log(`Merchant_order obtenida ${response.data.id}`);
            return response.data;
                        
        } catch (error) {
            console.error("Error obteniendo merchant_oder:", error.message);
            throw new Error(error);                        
        }
    }

    createPayment = async(paymentData) => {
        try {
            console.log("Services: creando pago con datos:", {
                payment_id: paymentData.payment_id,
                status: paymentData.status,
                cartId: paymentData.cartId
            });
                        
            return await this.paymentRepository.createPayment(paymentData);
        } catch (error) {
            console.error("Service Error creando pago:", error);
            
            throw new Error(`Error al crear el pago ${error.message}`);
        };
    };

    getPreference = async(preferenceId) => {
        try {
            console.log(`Obteniendo preferencia ${preferenceId}`);

            try {
                if(mercadopago?.preference) {
                    const response = mercadopago.preference.get(preferenceId);
                    console.log("Preferencia obtenida con SDK");
                    return response.body;                    
                }
            } catch (error) {
                console.log("SDK falló, intentando con Axios:", error.message);
                
            };

            const url = `https://api.mercadopago.com/checkout/preferences/${preferenceId}`
            const response = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${tokenMp}`,
                    "Content-type": "application/json"
                }
            });

            console.log("Preferencia obtenida con axios");
            return response.data
            
            
            // const preference = new Preference(client);
            // const response = await preference.get({ preferenceId });
            // return response;
        } catch (error) {
            console.error("Error al obtener la preferencia:", error.message);
            if(error.response) {
                console.error("Detalles del error:", {
                    status: error.response.status,
                    data: error.response.data
                });
            };            
            throw new Error("Error al obtener la preferencia:" + error.message);
        }
    };

    getAllPayment = async(userId) => {
        try {
            return await this.paymentRepository.getAllPayment(userId);
        } catch (error) {
            throw new Error(error.message || "Error al obtener los pagos")
        };
    };

    getById = async(id) => {
        try {
            const url = `https://api.mercadopago.com/v1/orders/${id}`
            const payment = await axios.get(url, {
                headers: {
                    "Conten-Type": "application/json",
                    Authorization: `Bearer ${tokenMp}`
                }
            });

            return payment.data;
            // const payment = await this.paymentRepository.getById(id);
            // if(!payment) {
            //     throw new Error(`No se encontró el payment con el id: ${id}`);
            // }
            // return payment;
        } catch (error) {
            console.error("Service Error obteniendo pago por ID:", error);
            
            throw new Error(`Error al obtener al pago por ID: ${error.message}`);
        };
    };

    getPaymentsByCartId = async(cartId) => {
        try {
            const payments = await this.paymentRepository.getPaymentsByCartId(cartId);
            return payments;
        } catch (error) {
            console.error("Service Error obteniendo pagos por cartId:", error);
            return [];            
        };
    };

    savePaymentToDatabase = async(paymentData, ticketId = null) => {
        try {
            const items = paymentData.additional_info?.items || [];
            const itemsFormatted = items.map(item => ({
                title: item.title,
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.quantity * item.unit_price
            }));

            const payment = new paymentModel({
                payment_id: paymentData.id,
                userId: paymentData.metadata?.userId,
                buyerEmail: paymentData.payer.email,
                status: paymentData.status,
                amount: paymentData.transaction_amount,
                items: itemsFormatted,
                cartId: paymentData.external_reference,
                ticketId: ticketId,
                paymentMethod: paymentData.payment_type_id,
                dateApproved: paymentData.date_approved,
                emailSent: true,
                processedAt: new Date()
            });

            const savedPayment = await payment.save();
            console.log(`Pago guardado en la BD: ${savedPayment.payment_id}`);
            return savedPayment;
            
        } catch (error) {
            console.error("Error al guardar el pago:", error);
            throw new Error("Error al guardar el pago:", error)
            return null;
        }
    }

    update = async(id, dataToUpdate) => {
        try {
            return await this.paymentRepository.update(id, dataToUpdate);
        } catch (error) {
            console.error("Service: Error actualizando pago:", error);
            
            throw new Error(`Error al actualizar el pago: ${error.message}`);
        };
    };

    delete = async(id) => {
        try {
            return await this.paymentRepository.delete(id);
        } catch (error) {
            console.error("Service Error eliminando el pago:", error);
            
            throw new Error(`Error al eliminar el pago: ${error.message}`);
        };
    };
};

export const paymentService = new PaymentService();