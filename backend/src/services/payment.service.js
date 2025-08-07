import { paymentRepository } from "../repository/payment.repository.js";
import mercadopago from "mercadopago";
import "dotenv/config";

mercadopago.configure({
    access_token: process.env.ACCES_TOKEN_MP
});

class PaymentService {
    constructor() {
        this.paymentRepository = paymentRepository;
    };

    createPreference = async( { userId, cart }) => {
        try {
            const env = process.env.NODE_ENV || "development"
            const isProduction = env === "production";
            const isTest = env === "test";
            const successUrl = isTest ? "https://example.com/success" : isProduction ? "https://example.com/success" : `http://localhost:8080/api/payments/success?userId=${userId}&cartId=${cart._id}`;
            const failureUrl = isTest ? "https://example.com/failure" : isProduction ? "https://example.com/failure" : `http://localhost:8080/compra-fallida`;
            const pendingUrl = isTest ? "https://example.com/pending" : isProduction ? "https://example.com/pending" : `http://localhost:8080/compra-pendiente`;

            const preference = {
                items: cart.products.map(p => ({    
                        title: p.id_prod.title,
                        quantity: p.quantity,
                        unit_price: p.id_prod.price
                    
                })),
                back_urls: {
                    success: successUrl,
                    failure: failureUrl,
                    pending: pendingUrl
                },
                auto_return: "approved"
            };            
            const response = await mercadopago.preferences.create(preference);
            return response.body
        } catch (error) {
            throw new Error("Error al crear la preferencia de pago: " + error.message);
        };
    };

    createPayment = async(payment) => {
        try {            
            return await this.paymentRepository.createPayment(payment);
        } catch (error) {
            throw new Error(error.message || "Error al crear los pagos");
        };
    };

    getAllPayment = async() => {
        try {
            return await this.paymentRepository.getAllPayment();
        } catch (error) {
            throw new Error(error.message || "Error al obtener los pagos")
        };
    };

    getById = async(id) => {
        try {
            const payment = await this.paymentRepository.getById(id);
            if(!payment) {
                throw new Error(`No se encontró el payment con el id; ${id}`);
            }
            return payment;
        } catch (error) {
            throw new Error(error.message || "Error al obtener al pago por ID");
        };
    };

    getPaymentById = async(paymentId) => {
        try {
            return await this.paymentRepository.getPaymentById(paymentId);
        } catch (error) {
            throw new Error(error.message || "Error al obtener el pago por paymentId");
        };
    };

    update = async(id, dataToUpdate) => {
        try {
            return await this.paymentRepository.update(id, dataToUpdate);
        } catch (error) {
            throw new Error(error.message || "Error al actualizar el pago");
        };
    };

    delete = async(id) => {
        try {
            return await this.paymentRepository.delete(id);
        } catch (error) {
            throw new Error(error.message || "Error al eliminar el pago");
        };
    };
};

export const paymentService = new PaymentService();