import { paymentRepository } from "../repository/payment.repository.js";
import mercadopago from "mercadopago";
import "dotenv/config";

mercadopago.configure({
    access_token: process.env.ACCES_TOKEN_MP
});

const frontendUrl = process.env.FRONTEND_URL;
const frontendLocal = process.env.FRONTEND_LOCAL;
// const backendUrl = process.env.BACKEND_URL;

class PaymentService {
    constructor() {
        this.paymentRepository = paymentRepository;
    };

    createPreference = async( { userId, cartId, cart }) => {
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

            const preference = {
                items: items,
                back_urls: {
                    success: successUrl,
                    failure: failureUrl,
                    pending: pendingUrl
                },
                external_reference: cartId,
                auto_return: "approved",
                sandbox_mode: true,
                metadata: {
                    userId: userId,
                    cartId: cartId,
                }
            };

            console.log("📋 Preferencia a crear:", JSON.stringify(preference, null, 2));

            const response = await mercadopago.preferences.create(preference);
            const preferenceId = response.body.id;
            console.log("Preferencia creada en MP. ID:", preferenceId);

            try {
                const updatePreference = {
                    ...preference,
                    metadata: {
                        ...preference.metadata,
                        preferenceId: preferenceId
                    }
                };

                await mercadopago.preferences.update(preferenceId, updatePreference);
                console.log("Metadata actualizado con preferenceId:", preferenceId);
                
            } catch (updateError) {
                console.warn("No se pudo actualizar metadata (no crítico):", updateError.message);                
            };
            
            return response.body
        } catch (error) {
             console.error("❌ Error en createPreference:", error);
            throw new Error("Error al crear la preferencia de pago: " + error.message);
        };
    };

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

    getAllPayment = async(userId) => {
        try {
            return await this.paymentRepository.getAllPayment(userId);
        } catch (error) {
            throw new Error(error.message || "Error al obtener los pagos")
        };
    };

    getById = async(id) => {
        try {
            const payment = await this.paymentRepository.getById(id);
            if(!payment) {
                throw new Error(`No se encontró el payment con el id: ${id}`);
            }
            return payment;
        } catch (error) {
            console.error("Service Error obteniendo pago por ID:", error);
            
            throw new Error(`Error al obtener al pago por ID: ${error.message}`);
        };
    };

    getPaymentById = async(paymentId) => {
        try {
            console.log("Service: Buscando pago por payment_id:", paymentId);
            
            return await this.paymentRepository.getPaymentById(paymentId);
        } catch (error) {
            console.error("Service: Error en getPaymentId:", error.message);
            
            throw new Error(`Error al obtener el pago por paymentId: ${error.message}`);
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