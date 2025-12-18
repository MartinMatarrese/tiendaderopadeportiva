import mercadopago from "mercadopago";
import { cartServices } from "../services/cart.service.js";
import { sendGmail } from "../services/email.service.js";
import { paymentService } from "../services/payment.service.js";
import { userService } from "../services/user.service.js";

const frontendUrl = process.env.FRONTEND_URL;
const webhookSecret = process.env.WEBHOOK_SECRET_MP;

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

    handleWebhook = async(req, res, next) => {
        try {
            const signature = req.headers["x-signature"] || req.headers["x-signature-sha256"];
            if(!signature || !webhookSecret) {
                console.warn("intento de webhook sin firma");
                return res.status(400).send("Firma requerida");
            };

            const crypto = require("crypto");
            const expectedSignature = crypto.createhmac("sha256", webhookSecret).update(JSON.stringify(req.body)).digest("hex")

            if(signature !== expectedSignature) {
                console.error("Firma de Webhook inválida - Posible ataque");
                return res.status(403).send("Firma inválida")
            };

            console.log("Webhook autenticado correctamente");

            const { type, data } = req.body;
            if(type === "payment") {
                const paymentId = data.id;
                console.log(`Procesando notificación para pago ID: ${paymentId}`);
                
                const mpResponse = await mercadopago.payment.findById(paymentId);
                const paymentDetails = mpResponse.body;

                const { status, external_reference } = paymentDetails;
                const cartId = external_reference;
                console.log(`Estado: ${status}, carrito: ${cartId}`);

                if(status === "approved") {
                    console.log(`Pago aprobado, procesando compra para carrito: ${cartId}`);
                    const resultadoCompra = await cartServices.purchaseCart(cartId);
                    console.log(`Ticket creado: ${resultadoCompra.ticket.code}`);
                    console.log(`Email enviado a: ${resultadoCompra.userEmail}`);
                    const paymentData = {
                        payment_id: paymentId,
                        status: status,
                        cartId: cartId,
                        userId: resultadoCompra.userId,
                        amount: resultadoCompra.ticket.amount,
                        ticketId: resultadoCompra.ticket._id
                    };

                    await paymentService.createPayment(paymentData);
                    console.log(`Pago guardado en BD con ID: ${paymentData.payment_id}`);
                } else {
                    console.log(`Pago no aprobado (${status}), no se proceso la compra`);                    
                }
            };

            res.status(200).send("OK");
            
        } catch (error) {
            console.error("Error en webhook:", error.message);
            res.status(200).send("Error procesado");
        };
    };

    handleSuccess = async(req, res, next) => {
        try {
            // const { payment_id, status, external_reference, preference_id } = req.query;

            // const cartId = external_reference;

            // console.log("Mercado pago reedirigio al backend con:", {
            //     payment_id,
            //     status,
            //     cartId: external_reference,
            //     payment_id
            // });

            // if(!payment_id || !external_reference) {
            //     console.error("Datos incompletos de mercado pago");
            //     return res.redirect(`${frontendUrl}#/payments/failure?message=datos_invalidos`);
            // };

            // if(status === "approved") {                
            //     try {
            //         console.log(`Procesando compra para carrito ${cartId}`);
            //         console.log("Tipo de cartId:", typeof cartId);                    
                    
            //         const resultadoCompra = await cartServices.purchaseCart(cartId);
            //         console.log("🔍 DESPUÉS de purchaseCart - resultado:", {
            //             tieneTicket: !!resultadoCompra.ticket,
            //             ticketId: resultadoCompra.ticket?._id,
            //             ticketCode: resultadoCompra.ticket?.code,
            //             productsOutStock: resultadoCompra.productsOutStock?.length,
            //             userEmail: resultadoCompra.userEmail
            //         });
            //         const { ticket, productsOutStock } = resultadoCompra;

            //         console.log("ticket creado:", {
            //             id: ticket._id,
            //             code: ticket.code,
            //             amount: ticket.amount,
            //             purchaser: ticket.purchaser
            //         });
                    
            //         if(productsOutStock.length > 0) {
            //             console.warn("Algunos productos sin Stock:", productsOutStock);
            //             return res.redirect(`${frontendUrl}#/payments/failure?message=stock=insuficiente`)
            //         };

            //         console.log(`Buscando carrito: ${cartId}`);

            //         const cart = await cartServices.getCartById(cartId);
            //         // const userId = cart.userId || cart.user?._id || ticket.purchaser;
            //         // const user = await userService.getUserByEmail(userId);
            //         let userId = null;

            //         if(cart.userId) {
            //             userId = cart.userId;
            //         } else if(cart.user && cart.user._id) {
            //             userId = cart.user._id;
            //         } else if(ticket.purchaser) {
            //             userId = ticket.purchaser;
            //         } else if(cart.user && cart.user.email) {
            //             const userByEmail = await userService.getUserByEmail(cart.user.email);
            //             userId = userByEmail._id;
            //         }

            //         if(!userId) {
            //             console.error("No se pudo obtener userID");
            //             throw new Error("UserId no encontrado");                                                
            //         };

            //         console.log("UserId obtenido:", userId);                    

            //         try {
            //             const user = await userService.getUserById(userId);
            //             if(user && user.email) {
            //                 await sendGmail(ticket, user.email, cart.products);
            //                 console.log(`Email enviado exitosamente a ${user.email}`);
            //             } else {
            //                 console.warn("No se pudo obtener usuario para enviar email");                            
            //             }
                        
            //         } catch (emailError) {
            //             console.error("Error enviando email:", emailError.message);                                                
            //         }                    

            //         const paymentData = {
            //             payment_id,
            //             status,
            //             cartId,
            //             userId,
            //             amount: ticket.amount,
            //             ticketId: ticket._id,
            //             emailSend: true
            //         };

            //         console.log("Datos del pago a guardar:", paymentData);                    

            //         const savedPayment = await paymentService.createPayment(paymentData);
            //         console.log("Pago registrad en BD:", savedPayment._id);

            //         const queryParams = new URLSearchParams({
            //             ticketId: ticket._id.toString(),
            //             payment_id: payment_id,
            //             cartId: cartId,
            //             amount: ticket.amount,
            //             status: "approved"
            //         }).toString();
    
            //         const redirectUrl = `${frontendUrl}#/payments/success?${queryParams}`;
            //         console.log("Reedirigiendo a frontend:", redirectUrl);
            //         return res.redirect(redirectUrl);

            //     } catch(error) {
            //         console.error("Error al procesar la compra:", error.message);
            //         console.error("stack trace:", error.stack);                    
            //         return res.redirect(`${frontendUrl}#/payments/failure?message=error_procesando`);
            //     };
                
            // } else {
            //     console.log(`Pago no aprobado. Status: ${status}`);
            //     return res.redirect(`${frontendUrl}#/payments/failure?message=pago_${status}`)
            // }

            const { status, preference_id } = req.query;
            console.log("Usuario reedirigido a /success. Status:", status,  "Preference ID:", preference_id);

            return res.redirect(`${frontendUrl}#/payments/success?preference_id=${preference_id}`);            
            
        } catch (error) {
            console.error("Error en handleSuccess: ", error.message);
            console.error("Stack trace:", error.stacj);             
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

            console.log("🔍 Preferencia encontrada - ID:", preferenceId, "cartId:", cartId);
            console.log("🔍 Buscando pagos para esta preferencia especifica...");

            // if(!cartId) {
            //     return res.json({
            //         status: "not_found",
            //         message: "No se encontró external_preferencece en la preferencia"
            //     });
            // };

            // console.log("🔄 Buscando pagos por cartId:", cartId);

            const paymentSearch = await mercadopago.payment.search({
                qs: {
                    "external_reference": cartId,
                    "sort": "date_created",
                    "criteria": "desc"
                }
            });

             console.log("📊 Resultados encontrados:", paymentSearch.body.results?.length || 0);
            let latestPayment = null;

            if(!paymentSearch.body.results || paymentSearch.body.results.length > 0) {
                // return res.json({
                //     status: "not_found",
                //     message: "No se encontraron pagos para esta preferencia"
                // });
                latestPayment = paymentSearch.body.results[0];
            };

            // const latestPayment = paymentSearch.body.results[0];

            // console.log("✅ PAGO ENCONTRADO:", {
            //     status: latestPayment.status,
            //     id: latestPayment.id,
            //     external_reference: latestPayment.external_reference,
            //     date_approved: latestPayment.date_approved
            // });
            
            if(!latestPayment) {
                console.log("No hay pagos para esta preferencia (Aún no se pagó)");
                return res.json({
                    status: "pending",
                    message: "Esperando pago",
                    preference_id: preferenceId,
                    cartId: cartId
                });
            };

            console.log("Pago encontrado para esta preferencia:", {
                status: latestPayment.status,
                id: latestPayment.id,
                preference_relation: "VERIFICAR",
                date_created: latestPayment.date_created
            });
            
            res.json({
                status: latestPayment.status,
                payment_id: latestPayment.id,
                external_reference: latestPayment.external_reference,
                date_approved: latestPayment.date_approved,
                status_detail: latestPayment.status_detail,
                current_preference_id: preferenceId
            });
            
        } catch (error) {
            console.error("Error en getPaymentStatus:", error);
            if (error.status === 404) {
                return res.json({ 
                    status: 'preference_not_found',
                    message: 'Preferencia no encontrada' 
                });
            };
        
            res.status(500).json({ 
                error: "Error al consultar el estado del pago",
                details: error.message 
            });
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