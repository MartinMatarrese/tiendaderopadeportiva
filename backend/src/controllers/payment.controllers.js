// import cartModel from "../daos/mongodb/models/cart.model.js";
// import PaymentResDto from "../dtos/payment.res.dto.js";
// import TicketResDto from "../dtos/ticket.res.dto.js";
import { cartServices } from "../services/cart.service.js";
import { paymentService } from "../services/payment.service.js";
import { userService } from "../services/user.service.js";

class PaymentController {
    constructor() {
        this.paymentService = paymentService;
    };

    createPreference = async(req, res, next) => {
        try {
            const { cartId, cart } = req.body;
            // const cart = await cartModel.findById(cartId).populate("products.id_prod");
            
            if(!cart || !Array.isArray(cart.products) || cart.products.length === 0){                 
                throw new Error("El carrito esta vacio o no se encontró");
            };
            const preference = await this.paymentService.createPreference({ cartId, cart });
            res.status(200).json({ init_point: preference.init_point });
        } catch (error) {            
            next(error);
        };
    };

    createPayment = async(req, res, next) => {
        try {
            const { paymentId, userId, amount, status, cartId, ticketId} = req.body
            const respuesta = await this.paymentService.createPayment({paymentId, userId, amount, status, cartId, ticketId});
            res.status(201).send(respuesta);
        } catch (error) {
            next(error);
        };
    };

    getAllPayment = async(req, res, next) => {
        try {
            const userId = req.user._id;
            const payments = await this.paymentService.getAllPayment(userId);
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
            const { payment_id, status, external_reference, cartId } = req.query;
            const paymentData = {
                    paymentId: payment_id,
                    status,
                    cartId: external_reference || cartId
                };

            if(status === "approved") {
                const resuladoCompra = await cartServices.purchaseCart(cartId);
                const { ticket, productsOutStock } = resuladoCompra;
                
                if(productsOutStock.length > 0) {
                    console.warn("Algunos productos estaban sin stock:", productsOutStock);
                    return res.redirect(`http://localhost:3000/tiendaderopadeportiva/payments/failure?message=stock_insuficiente`);
                };
                paymentData.amount = ticket.amount;
                paymentData.ticketId = ticket._id?.toString();
        
                const payment = await paymentService.createPayment(paymentData);

                try {
                    const user = await userService.getUserById(paymentData.userId)
                    const cart = await cartServices.getCartById(cartId)
                    await sendGmail(ticket, user.email, cart.products)
                    console.log(`Email de confirmación enviado a ${user.email}`);
                    
                } catch(error) {
                    console.error("Error al enviar el email de confirmación", error.message);                    
                }

                // const ticketDto = new TicketResDto(ticket);
                // const paymentDto = new PaymentResDto(payment);

                // return res.status(200).json({ticket: {...ticketDto}, payment: {...paymentDto}})
                return res.redirect(`http://localhost:3000/tiendaderopadeportiva/payments/success?payment_id=${payment_id}&cartId=${paymentData.cartId}&ticketId=${ticket._id}`);

            };             
            await paymentService.createPayment(paymentData);
            // return res.redirect("http://localhost:8080/");
            return res.redirect(`http://localhost:3000/tiendaderopadeportiva/payments/success?payment_id=${payment_id}&cartId=${paymentData.cartId}`)
        } catch (error) {
            console.error("Error en handleSuccess: ", error);            
            res.redirect("http://localhost:3000/tiendaderopadeportiva/payments/failure");
        };
    };

    getPaymentById = async(req, res, next) => {
        try {
            const { paymentid } = req.params
            const payment = await this.paymentService.getPaymentById(paymentid)
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
            res.status(200).send({ message: "Pago eliminado con éxito" });
        } catch (error) {
            next(error);
        };
    };

};

export const paymentController = new PaymentController();