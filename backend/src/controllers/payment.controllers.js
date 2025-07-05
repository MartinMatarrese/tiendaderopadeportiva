import { cartServices } from "../services/cart.service.js";
import { paymentService } from "../services/payment.service.js";

class PaymentController {
    constructor() {
        this.paymentService = paymentService;
    };

    createPreference = async(req, res, next) => {
        try {
            const { userId, cartId, amount } = req.body;
            const preference = await this.paymentService.createPreference({ userId, cartId, amount });
            res.status(200).json({ init_point: preference.init_point });
        } catch (error) {
            next(error);
        };
    };

    createPayment = async(req, res, next) => {
        try {
            const { paymentId, userId, amount, status, cartId} = req.body
            const respuesta = await this.paymentService.createPayment({paymentId, userId, amount, status, cartId});
            res.status(201).send(respuesta);
        } catch (error) {
            next(error);
        };
    };

    getAllPayment = async(req, res, next) => {
        try {
            const payments = await this.paymentService.getAllPayment()
            res.status(200).json(payments);
        } catch (error) {
            next(error)
        };
    };

    getById = async(req, res, next) => {
        try {
            const { id } = req.params;
            const payment = await this.paymentService.getById(id);
            if(!payment) {
                return res.status(401).json({ message: "Pago no encontrado" });
            };
            res.status(200).json(payment);
        } catch (error) {
            next(error)
        };
    };

    handleSuccess = async(req, res, next) => {
        try {
            const { payment_id, status } = req.query;
            const { userId, cartId } = req.query;
            let paymentData = {
                paymentId: payment_id,
                userId,
                status,
                cartId,
                amount: 0
            }

            if(status === "approved") {
                const resuladoCompra = await cartServices.purchaseCart(cartId);
                const { ticket, productsOutStock } = resuladoCompra;
                paymentData.amount = ticket.amount;
                paymentData.ticketId = ticket._id;
                console.log("ticket generado: ", ticket);
                if(productsOutStock.length > 0) {
                    console.warn("Algunos productos estaban sin stock:", productsOutStock);
                    res.status(404).send({message: "Algunos productos estaban sin stock"});
                };
                res.status(200).send(ticket)
            } 
            await paymentService.createPayment(paymentData);
            res.redirect("http://localhost:8080/");
        } catch (error) {
            next(error)
        };
    };

    getPaymentById = async(req, res, next) => {
        try {
            const { paymentId } = req.params
            const payment = await this.paymentService.getPaymentById(paymentId)
            if(!payment) {
                return res.status(404).send({ message: "Pago no encontrado" });
            };
            res.status(200).send(payment);
        } catch (error) {
            next(error)
        };
    };

    update = async(req, res, next) => {
        try {
            const { paymentId } = req.params;
            const updatePayment = req.body;
            await this.paymentService.update(paymentId, updatePayment);
            res.status(200).send({ message: "Pago actualizado"});
        } catch (error) {
            next(error);
        };
    };

    delete = async(req, res, next) => {
        try {
            const { paymentId } = req.params;
            await this.paymentService.delete(paymentId);
            res.status(200).send({ message: "Pago elimiado con éxito" });
        } catch (error) {
            next(error);
        };
    };

};

export const paymentController = new PaymentController();