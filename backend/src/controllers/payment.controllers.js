import mercadopago from "mercadopago";
import { cartServices } from "../services/cart.service.js";
import { sendGmail } from "../services/email.service.js";
import { paymentService } from "../services/payment.service.js";
import { userService } from "../services/user.service.js";

const frontendUrl = process.env.FRONTEND_URL;

class PaymentController {
    constructor() {
        this.paymentService = paymentService;
    };

    createPreference = async(req, res, next) => {
        try {
            const { cartId, cart, userId } = req.body;
            
            if(!cart || !Array.isArray(cart.products) || cart.products.length === 0){                 
                throw new Error("El carrito esta vacio o no se encontró");
            };

            const preference = await this.paymentService.createPreference({ userId, cartId, cart });

            res.status(200).json({ id: preference.id });
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

            console.log("Parámetros recibidos en handleSuccess:", {
                payment_id,
                status,
                external_reference,
                cartId
            });

            if(status === "approved") {
                const cartIdToProcess = external_reference;

                if(!cartIdToProcess) {
                    console.error("No hay external_reference (cartId)");
                    return res.redirect(`${frontendUrl}payments/failure?message=missing_cart_id`);
                }

                console.log("Procesando compra aporvada por cartId:", cartIdToProcess);
                
                try {
                    const resuladoCompra = await cartServices.purchaseCart(cartIdToProcess);
                    const { ticket, productsOutStock } = resuladoCompra;

                    if(productsOutStock.length > 0) {
                        console.warn("Algunos productos sin Stock:", productsOutStock);
                        return res.redirect(`${frontendUrl}payments/failure?message=stock=insuficiente`)
                    };

                    const paymentData = {
                        payment_id: payment_id,
                        status,
                        cartId: cartIdToProcess,
                        amount: ticket.amount,
                        ticketId: ticket._id?.toString()
                    }

                    const payment = await paymentService.createPayment(paymentData);

                    try {
                        const user = await userService.getUserById(paymentData.userId);
                        const cart = await cartServices.getCartById(cartIdToProcess);
                        await sendGmail(ticket, user.email, cart.products);
                        console.log(`Email de confirmación enviado a ${user.email}`);
                        
                    } catch (error) {
                        console.error("Error al enviar el email:", error.message);                        
                    };

                    return res.redirect(`${frontendUrl}payments/success?payment_id=${payment_id}&external_reference=${external_reference}&tickerId=${ticket._id}`);
                } catch (error) {
                    console.error("Error al procesar la compra");
                    return res.redirect(`${frontendUrl}payments/failure?message=error_procesando_compra`)                    
                };
            } else {
                console.log(`Pago no aprobado ${status}`);
                
                const paymentData = {
                    paymentId: payment_id || "null",
                    status: status || "null",
                    cartId: external_reference || cartId || "null"
                };

                await paymentService.createPayment(paymentData);

                let errorMessage = "pago_rechazado";

                if(status === "rejected") errorMessage = "pago_rechazado";
                else if(status === "cancelled") errorMessage = "pago_cancelado";
                else if(status === "in_process") errorMessage = "pago_pendiente";
                else errorMessage = "error_desconocido";

                return res.redirect(`${frontendUrl}payments/failure?message=${errorMessage}&payment_id=${payment_id}&external_rederence=${external_reference}`);
            }
            
            // const paymentData = {
            //         paymentId: payment_id,
            //         status,
            //         cartId: external_reference || cartId
            //     };

            // if(status === "approved") {
            //     const cartIdToProcess = external_reference;
                
            //     if(!cartIdToProcess) {
            //         console.error("No hay external_reference (cartId)");
            //         return res.redirect(`${frontendUrl}payments/failure?message=error_procesando_pago`);
            //     };

            //     console.log("Procesando compra para cartId:", cartIdToProcess);

            //     const resuladoCompra = await cartServices.purchaseCart(cartIdToProcess);
            //     const { ticket, productsOutStock } = resuladoCompra;

            //     if(productsOutStock.length > 0) {
            //         console.warn("Algunos productos estaban sin stock:", productsOutStock);
            //         return res.redirect(`${frontendUrl}payments/failure?message=stock_insuficiente`);
            //     };

            //     paymentData.amount = ticket.amount;
            //     paymentData.ticketId = ticket._id?.toString();
        
            //     const payment = await paymentService.createPayment(paymentData);

            //     try {
            //         const user = await userService.getUserById(paymentData.userId)
            //         const cart = await cartServices.getCartById(cartId)
            //         await sendGmail(ticket, user.email, cart.products)
            //         console.log(`Email de confirmación enviado a ${user.email}`);
                    
            //     } catch(error) {
            //         console.error("Error al enviar el email de confirmación", error.message);                    
            //     }

            //     return res.redirect(`${frontendUrl}payments/success?payment_id=${payment_id}&external_reference=${external_reference}&ticketId=${ticket._id}`);

            // };
            // await paymentService.createPayment(paymentData);

            // return res.redirect(`${frontendUrl}payments/success?payment_id=${payment_id}&external_reference=${external_reference}`)
        } catch (error) {
            console.error("Error en handleSuccess: ", error);            
            res.redirect(`${frontendUrl}payments/failure?message=error_interno`);
        };
    };

    getPaymentStatus = async(req, res, next) => {
        try {
            const { preferenceId } = req.params;
            console.log("Consultando estado para preferenceId:", preferenceId);
            if(!preferenceId) {
                return res.status(400).json({error: "preferenceId es requerido"});
            }

            const paymentSearch = await mercadopago.payment.search({
                qs: {
                    "preference_id": preferenceId,
                    "sort": "date_created",
                    "criteria": "desc"
                }
            });

            console.log("Resultado de búsqueda:", paymentSearch.body.results.length);;
            
            if(paymentSearch.body.results.length === 0) {
                return res.json({
                    status: "not_found",
                    message: "No se encontraron pagos para esta preferencia"
                });
            };

            const latestPayment = paymentSearch.body.results[0];

            res.json({
                status: latestPayment.status,
                payment_id: latestPayment.id,
                external_reference: latestPayment.external_reference,
                date_approved: latestPayment.date_approved,
                status_detail: latestPayment.status_detail
            });
            
        } catch (error) {
            console.error("Error en getPaymentStatus:", error);
            next(error);
        }
    }

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