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
            const { cartId } = req.body;
            console.log("cartId recibido en createPreference:", cartId);

            if(!cartId) {
                throw new Error("cartId es requerido");                
            }
            
            const cart = await cartServices.getCartById(cartId)
            
            if(!cart || !Array.isArray(cart.products) || cart.products.length === 0){                 
                throw new Error("El carrito esta vacio o no se encontró");
            };

            const userId = req.user._id;

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
            const { payment_id, status, external_reference, preference_id } = req.query;

            const cartId = external_reference;

            console.log("Mercado pago reedirigio al backend con:", {
                payment_id,
                status,
                cartId: external_reference,
                payment_id
            });

            if(!payment_id || !external_reference) {
                console.error("Datos incompletos de mercado pago");
                return res.redirect(`${frontendUrl}#/payments/failure?message=datos_invalidos`);
            };

            if(status === "approved") {                
                try {
                    const resuladoCompra = await cartServices.purchaseCart(cartId);
                    const { ticket, productsOutStock } = resuladoCompra;

                    if(productsOutStock.length > 0) {
                        console.warn("Algunos productos sin Stock:", productsOutStock);
                        return res.redirect(`${frontendUrl}#/payments/failure?message=stock=insuficiente`)
                    };

                    const cart = await cartServices.getCartById(cartId);
                    const userId = cart.userId || cart.user?._id || ticket.purchaser;
                    const user = await userService.getUserByEmail(userId);


                    try {
                        await sendGmail(ticket, user.email, cart.products);
                        console.log(`Email enviado exitosamente a ${user.email}`);
                        
                    } catch (error) {
                        console.error("Error enviando email:", error.message);
                                                
                    }

                    console.log("UserId obtenido:", userId);                    
                    

                    const paymentData = {
                        payment_id,
                        status,
                        cartId,
                        userId,
                        amount: ticket.amount,
                        ticketId: ticket._id
                    };

                    console.log("Datos del pago a guardar:", paymentData);                    

                    await paymentService.createPayment(paymentData);
                    console.log("Pago registrad en BD");                    

    
                    const redirectUrl = `${frontendUrl}#/payments/success?ticketId=${ticket._id}&payment_id=${payment_id}`;
                    console.log("Reedirigiendo a frontend:", redirectUrl);
                    return res.redirect(redirectUrl);

                } catch(error) {
                    console.error("Error al procesar la compra:", error);
                    return res.redirect(`${frontendUrl}#/payments/failure?message=error_procesando`);
                };
                
            } else {
                console.log(`Pago no aprobado. Status: ${status}`);
                return res.redirect(`${frontendUrl}#/payments/failure?message=pago_${status}`)
            }
            
        } catch (error) {
            console.error("Error en handleSuccess: ", error);            
            res.redirect(`${frontendUrl}#/payments/failure?message=error_interno`);
        };
    };

    getPaymentStatus = async(req, res, next) => {
        try {
            const { preferenceId } = req.params;
            console.log("Consultando estado para preferenceId:", preferenceId);
            if(!preferenceId) {
                return res.status(400).json({error: "preferenceId es requerido"});
            };

            console.log("🔄 Obteniendo preferencia...");
            const preference = await mercadopago.preferences.get(preferenceId);
            const cartId = preference.body.external_reference;

            console.log("🔍 Preferencia encontrada - cartId:", cartId);
            console.log("🔍 External reference:", cartId);

            if(!cartId) {
                return res.json({
                    status: "not_found",
                    message: "No se encontró external_preferencece en la preferencia"
                });
            };

            console.log("🔄 Buscando pagos por cartId:", cartId);

            const paymentSearch = await mercadopago.payment.search({
                qs: {
                    "external_reference": cartId,
                    "sort": "date_created",
                    "criteria": "desc"
                }
            });

             console.log("📊 Resultados encontrados:", paymentSearch.body.results?.length || 0);
            
            if(!paymentSearch.body.results || paymentSearch.body.results.length === 0) {
                return res.json({
                    status: "not_found",
                    message: "No se encontraron pagos para esta preferencia"
                });
            };

            const latestPayment = paymentSearch.body.results[0];

            console.log("✅ PAGO ENCONTRADO:", {
                status: latestPayment.status,
                id: latestPayment.id,
                external_reference: latestPayment.external_reference,
                date_approved: latestPayment.date_approved
            });
            

            res.json({
                status: latestPayment.status,
                payment_id: latestPayment.id,
                external_reference: latestPayment.external_reference,
                date_approved: latestPayment.date_approved,
                status_detail: latestPayment.status_detail
            });
            
        } catch (error) {
            console.error("Error en getPaymentStatus:", error);
            if (error.status === 404) {
                return res.json({ 
                    status: 'preference_not_found',
                    message: 'Preferencia no encontrada' 
                });
            }
        
            res.status(500).json({ 
                error: "Error al consultar el estado del pago",
                details: error.message 
            });
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