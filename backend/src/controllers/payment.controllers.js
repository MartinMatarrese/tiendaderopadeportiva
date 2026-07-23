import mercadopago from "mercadopago";
import crypto from "crypto";
import { cartServices } from "../services/cart.service.js";
// import { sendGmail } from "../services/email.service.js";
import { paymentService } from "../services/payment.service.js";
import { error } from "console";
import { type } from "os";
// import { userService } from "../services/user.service.js";

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
            const userEmail = req.user.email

            const preference = await this.paymentService.createPreference({ userId, cartId, cart, userEmail });

            res.status(200).json({ id: preference.id });
        } catch (error) {            
            next(error);
        };
    };

    createPayment = async(req, res, next) => {
        try {
            const { payment_id, userId, amount, status, cartId, ticketId} = req.body
            const respuesta = await this.paymentService.createPayment({payment_id, userId, amount, status, cartId, ticketId});
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

        console.log("[WEBHOOK] Solicitud recibida");
        console.log("Query params:", req.query);
        console.log("Body:", req.body);

        try {
            const notification = {
                type: req.query.topic || req.query.type || req.body?.topic || req.body?.type,
                data: {
                    id: req.query.id || req.query["data.id"] || req.body?.data?.id || req.body?.id
                }
            };
            console.log("Notificación procesada:", notification);
            if(!notification.type || !notification.data.id) {
                console.error("Datos incompletos en la notificación");
                return res.status(400).send("Datos incompletos")                
            };
            if(notification.type === "merchant_order") {
                console.log(`Procesando orden comercial ID: ${notification.data.id}`);
                const merchantOrder =  await paymentService.getMerchantOrder(notification.data.id);
                const payments = merchantOrder.payments || [];
                console.log(`Orden tiene ${payments.length} pagos asociados`);
                for(const payment of payments) {
                    if(payment.status === "approved") {
                        console.log(`Pago aprobado en orden ${payment.id}`);
                        
                        const result = await paymentService.webHook({
                            type: "payment",
                            data: { id: payment.id }
                        });
                        console.log("Pago procesado:", result);
                        
                    } else {
                        console.log(`Pago ${payment.id} en estado ${payment.status}`);
                        
                    }
                }
            } else if(notification.type === "payment") {
                console.log(`Procesando pago ID ${notification.data.id}`);
                const result = await paymentService.webHook({
                    type: "payment",
                    data: { id: notification.data.id }
                });
                console.log("Pago procesado:", result);
            } else {
                console.log(`Tipo de notificación no manejado: ${notification.type}`);
                
            }
            res.status(200).send("OK")
            
            // if(webhookSecret) {
            //     const signature = req.headers["x-signature"] || req.headers["x-signature-sha256"];

            //     if(signature) {
            //         const parts = signature.split(",");
            //         const signatureMap = {};
            //         parts.forEach(part => {
            //             const [ key, value ] = part.split("=");
            //             signatureMap[key] = value;
            //         });
            //         const timesTamp = signatureMap.ts;
            //         const signatureHash = signatureMap.v1;
            //         const message = `${timesTamp}.${JSON.stringify(req.body)}`
            //         const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(message).digest("hex");
            //         const signatureMath = crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedSignature));
            //         if(!signatureMath) {
            //             console.warn("Firma inválida - Continuando de todas formas");                        
            //         } else {
            //             console.log("Firma verdificada correctamente");                        
            //         };
            //     };
            // };
            // const notification = {
            //     type: req.query.type || req.body?.type,
            //     data: {
            //         id: req.query["data.id"] || req.body?.data?.id
            //     }
            // };

            // console.log("Notificación procesada:", notification);

            // if(!notification.type || !notification.data.id) {
            //     console.error("Datos incompletos en la notificación");
            //     return res.status(400).send("Datos incompleltos");
            // }

            // if(notification.type === "payment") {
            //     console.log(`Procesando pago ID: ${notification.data.id}`);
            //     const result = await paymentService.webHook({
            //         type: "payment",
            //         data: { id: notification.data.id }
            //     });
            //     console.log("Pago procesado:", result);               
            // } else {
            //     console.log(`Tipo de notificación no manejado: ${notification.type}`);                
            // };

            // res.status(200).send("OK")
            
        } catch (error) {
            console.error("Error general en webhook:", error.message);
            console.error("Stack:", error.stack);
            return res.status(200).send("OK");
        };
                
        // try {
        //     const notification = {
        //         type: req.query.type || req.body?.type,
        //         data: {
        //             id: req.query["data.id"] || req.body?.data?.id
        //         }
        //     }
        //     console.log("Notificación procesada:", notification);

        //     if(!notification.type || !notification.data.id) {
        //         console.error("Datos incompletos en la notificación");
        //         return res.status(400).send("Datos incompletos");
        //     };

        //     try {
        //         if(!webhookSecret) {
        //             console.error("MP_WEBHOOK_SECRET No configurada");
        //             return res.status(500).send("Error de configuración")                
        //         }

        //         const signature = req.headers["x-signature"] || req.headers["x-signature-sha256"];

        //         if(!signature) {
        //             console.warn("Webhook sin firma - Rechazado");
        //             return res.status(400).send("Firma requerida");
        //         };

        //         const expectedSignature = crypto.createHmac("sha256", webhookSecret).update(JSON.stringify(req.body)).digest("hex");

        //         let signatureMath = false;
        //         try {
        //             signatureMath = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
        //         } catch (error) {
        //             console.error("Error en comparacion de firmas:", error.message);
        //             return res.status(400).send("Firma inválida");                
        //         };

        //         if(!signatureMath) {
        //             console.error("Firma inválida - Posible ataque");
        //             return res.status(403).send("Firma inválida");
        //         };

        //         console.log("webhook autenticado (Firma Válida)");

        //     } catch (error) {
        //         console.error("Error verificando firma:", error.message);
        //         return res.status(200).send("Error procesado");            
        //     };

        //     console.log(`Procesando notificación: ${notification.type} - ${notification.data.id}`);
        //     const result = await paymentService.webHook(notification);
            
        //     res.status(200).send("OK")
            
        // } catch (error) {
        //     console.error("Error general en Webhook:", error.message);
        //     console.error("Stack:", error.stack);           
        //     return res.status(200).send("OK")
        // };       
        
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
            console.error("Stack trace:", error.stack);             
            res.redirect(`${frontendUrl}#/payments/failure?message=error_interno`);
        };
    };

    getPaymentStatus = async(req, res, next) => {
        try {
            const { preferenceId } = req.params;
            console.log("Consultando estado para preferenceId:", preferenceId);

            if(!preferenceId) {
                return res.status(400).json({
                    success: false,
                    message: "preferenceId es requerido"
                });
            };

            console.log("🔄 Obteniendo preferencia...");
            const preference = await paymentService.getPreference(preferenceId);

            if(!preference) {
                return res.status(404).json({
                    success: false,
                    message: "Preferencia no encontrada"
                });
            };

            return res.status(200).json({
                success: true,
                data: {
                    id: preference.id,
                    status: preference.status || "pending",
                    init_point: preference.init_point,
                    sandbox_init_point: preference.sandbox_init_point,
                    external_reference: preference.external_reference,
                    items: preference.items,
                    payer: preference.payer,
                    date_created: preference.date_created
                }
            });
            // const preference = await mercadopago.preferences.get(preferenceId);
            // const cartId = preference.body.external_reference;
            
            // const cartId = preference.body?.external_reference || preference.external_reference;

            // console.log("Preferencia obtenida cartId:", cartId);
            
            // if(!cartId) {
            //     return res.json({
            //         status: "not_found",
            //         message: "No se encontró external_preferencece en la preferencia"
            //     });
            // };

            // const existingPayment = await this.paymentService.getPaymentsByCartId(cartId);
            
            // if(existingPayment && existingPayment.length > 0) {
            //     const latestPayment = existingPayment[0];
            //     console.log("Pago encontrado en la BD local");
            //     return res.json({
            //         status: latestPayment.status,
            //         payment_id: latestPayment.payment_id,
            //         preference_id: preferenceId,
            //         cartId: cartId,
            //         from_database: true,
            //         ticketId: latestPayment.ticketId
            //     })
            // };

            // console.log("Buscando pagos en Mercado pago....");
            // const paymentSearch = await this.paymentService.searchPaymentByExternalReference(cartId);
            // const allPayments = paymentSearch.results || [];
            // let paymentStatus = "pending";
            // let paymentId = null;
            // let currentPayment = null;

            // if (allPayments.length > 0) {
            //     currentPayment = allPayments[0];
            //     paymentStatus = currentPayment.status;
            //     paymentId = currentPayment.id;

            //     console.log("Pago encontrado:", { id: paymentId, status: paymentStatus });

            //     // 4. Si el pago está aprobado, procesar la compra
            //     if (paymentStatus === "approved") {
            //         console.log(`✅ Pago aprobado! Procesando carrito ${cartId}...`);
                    
            //         try {
            //             const userId = req.user?._id;
            //             const resultado = await this.cartServices.purchaseCart(cartId);
                        
            //             // Guardar el pago en tu BD
            //             await this.paymentService.createPaymentRecord({
            //                 payment_id: paymentId,
            //                 status: paymentStatus,
            //                 cartId: cartId,
            //                 userId: resultado.userId || userId,
            //                 amount: resultado.ticket?.amount,
            //                 ticketId: resultado.ticket?._id,
            //                 processedAt: new Date(),
            //                 emailSent: true
            //             });
                        
            //             console.log(`✅ Compra procesada. Ticket: ${resultado.ticket?.code}`);
                        
            //         } catch (error) {
            //             console.error("Error procesando compra:", error.message);
            //             await this.paymentService.createPaymentRecord({
            //                 payment_id: paymentId,
            //                 status: paymentStatus,
            //                 cartId: cartId,
            //                 error: error.message,
            //                 processedAt: new Date(),
            //                 emailSent: false
            //             });
            //         }
            //     }
            // }

            // res.json({
            //     status: paymentStatus,
            //     payment_id: paymentId,
            //     preference_id: preferenceId,
            //     cartId: cartId,
            //     total_payments_found: allPayments.length,
            //     from_database: false
            // });


            // console.log("🔄 Buscando pagos por cartId:", cartId);

            // const paymentSearch = await mercadopago.payment.search({
            //     qs: {
            //         "external_reference": cartId,
            //         "sort": "date_created",
            //         "criteria": "desc"
            //     }
            // });

            //  console.log("📊 Resultados encontrados:", paymentSearch.body.results?.length || 0);
            // let latestPayment = null;

            // if(!paymentSearch.body.results || paymentSearch.body.results.length > 0) {
            //     // return res.json({
            //     //     status: "not_found",
            //     //     message: "No se encontraron pagos para esta preferencia"
            //     // });
            //     latestPayment = paymentSearch.body.results[0];
            // };

            // const latestPayment = paymentSearch.body.results[0];

            // console.log("✅ PAGO ENCONTRADO:", {
            //     status: latestPayment.status,
            //     id: latestPayment.id,
            //     external_reference: latestPayment.external_reference,
            //     date_approved: latestPayment.date_approved
            // });
            
            // if(!latestPayment) {
            //     console.log("No hay pagos para esta preferencia (Aún no se pagó)");
            //     return res.json({
            //         status: "pending",
            //         message: "Esperando pago",
            //         preference_id: preferenceId,
            //         cartId: cartId
            //     });
            // };

            // console.log("Pago encontrado para esta preferencia:", {
            //     status: latestPayment.status,
            //     id: latestPayment.id,
            //     preference_relation: "VERIFICAR",
            //     date_created: latestPayment.date_created
            // });
            
            // res.json({
            //     status: latestPayment.status,
            //     payment_id: latestPayment.id,
            //     external_reference: latestPayment.external_reference,
            //     date_approved: latestPayment.date_approved,
            //     status_detail: latestPayment.status_detail,
            //     current_preference_id: preferenceId
            // });

            // console.log("Fecha creacion preferencia:", preference.body.date_created);

            // console.log(`Buscando pagos en nuestra BD para carrito: ${cartId}`);
            
            // const existingPayment = await paymentService.getPaymentsByCartId(cartId)

            // if(existingPayment && existingPayment.length > 0) {
            //     console.log(`Encontrados ${existingPayment.length} pagos en nuestra BD`);

            //     const latestPayment = existingPayment[0];
            //     console.log("Pago encontrado en BD local::", {
            //         payment_id: latestPayment.payment_id,
            //         satus: latestPayment.status,
            //         processedAt: latestPayment.processedAt
            //     });

            //     return res.json({
            //         status: latestPayment.status,
            //         payment_id: latestPayment.payment_id,
            //         preference_id: preferenceId,
            //         cartId: cartId,
            //         total_payments_found: existingPayment.length,
            //         from_database: true,
            //         emailSent: latestPayment.emailSent,
            //         ticketId: latestPayment.ticketId
            //     });               
            // };

            // console.log("No hay pagos en BD local, consultando a Mercado Pago...");
            // console.log("Buscando pagos en Mercado Pago por cartId:", cartId);
            
            

            // const paymentSearch = await mercadopago.payment.search({
            //     qs: {
            //         "external_reference": cartId,
            //         "sort": "date_created",
            //         "criteria": "desc"
            //     }
            // });

            // const allPayments = paymentSearch.body.results || [];
            // console.log("Total de pagos encontrados para este carrito:", allPayments.length);
            
            // let currentPayment = null;

            // // for(const payment of allPayments) {
            // //     const paymentData = new Date(payment.date_created);
            // //     const preferenceDate = new Date(preference.body.date_created);
            // //     const timeDiff = Math.abs(paymentData - preferenceDate) / 1000;
                
            // //     if(timeDiff < 300 ) {
            // //         console.log(`Pago ${payment.id} es reciente (${timeDiff} segundos despúes)`);
            // //         currentPayment = payment;
            // //         break;                    
            // //     };
            // // };

            // // if(!currentPayment && allPayments.length > 0) {
            // //     currentPayment = allPayments[0];
            // //     console.log(`Usamdp el pago más reciente: ${currentPayment.id} (No confirmado por metadata)`);
                
            // // }

            // let paymentStatus = "pending";
            // let paymentId = null;

            // // if(preference.body.payments && preference.body.length > 0) {
            // //     const latestPayment = preference.body.payments[preference.body.payments.length - 1];
            // //     paymentStatus = latestPayment.status;
            // //     paymentId = latestPayment.id;
            // // } else if(preference.body.metadata && preference.body.metadata.payment_id) {
            // //     paymentId = preference.body.metadata.payment_id;
            // //     const paymentResponse = await mercadopago.payment.findById(paymentId);
            // //     paymentStatus = paymentResponse.body.status;
            // // } else {
            // //     console.log("Buscando pagos con metadata.preference_id:", preferenceId);
            // //     const paymentSearch = await mercadopago.payment.search({
            // //         qs: {
            // //             "metadata_preference_id": `${preferenceId}`,
            // //             "sort": "date_created",
            // //             "criteria": "desc"
            // //         }
            // //     });

            // //     if(paymentSearch.body.results && paymentSearch.body.results.length > 0) {
            // //         const latestPayment = paymentSearch.body.results[0];
            // //         paymentStatus = latestPayment.status;
            // //         paymentId = latestPayment.id;
            // //     };
            // // };

            // if(allPayments.length > 0) {
            //     currentPayment = allPayments[0];
            //     paymentStatus = currentPayment.status;
            //     paymentId = currentPayment.id

            //     console.log("Pago más reciente en Mercado Pago:", {
            //         id: currentPayment.id,
            //         status: currentPayment.status,
            //         date_created: currentPayment.date_created,
            //         res_reciente: Math.abs(new Date() - new Date(currentPayment.date_created)) / 60000
            //     });

            //     if(paymentStatus === "approved") {
            //         console.log(`Pago aprobado! procesando carrito ${cartId}...`);

            //         try {
            //             const existingPayment = await paymentService.getPaymentById(paymentId);

            //             if(!existingPayment) {
            //                 console.log(`Ejecutando purchaseCart para ${cartId}...`);
            //                 const userId = req.user?._id;
            //                 console.log("Usuario ID:", userId);

            //                 try {

            //                     const resultado = await cartServices.purchaseCart(cartId);
            //                     console.log(`Compra porcesada. Email enviado a: ${resultado.userEmail}`);
            //                     console.log(`Ticket creado: ${resultado.ticket.code}`);
                                
            //                     await paymentService.createPayment({
            //                         payment_id: paymentId,
            //                         status: paymentStatus,
            //                         cartId: cartId,
            //                         userId: resultado.userId || userId,
            //                         amount: resultado.ticket.amount,
            //                         ticketId: resultado.ticket._id,
            //                         processedAt: new Date(),
            //                         emailSent: true
            //                     });

            //                     console.log(`Pago ${paymentId} guardado en la BD`);                               
                                
            //                 } catch (error) {
            //                     console.error("Error en purchaseCart:", error.message);
            //                     await paymentService.createPayment({
            //                         payment_id: paymentId,
            //                         status: paymentStatus,
            //                         cartId: cartId,
            //                         error: error.message,
            //                         processeAt: new Date(),
            //                         emailSent: false
            //                     });                                
            //                 };
            //             } else {
            //                 console.log(`Pago ${paymentId} ya fue procesado anteriormente`);                            
            //             };

            //         } catch (error) {
            //             console.error("Error verificando pago en BD:", error.message);                        
            //         };
            //     };
                
            // } else {
            //     console.log("No hay pagos en Mercado Pago para esta preferencia");                
            // }

            // console.log("Estado deretminado:", { paymentStatus, paymentId });

            // res.json({
            //     status: paymentStatus,
            //     payment_id: paymentId,
            //     preference_id: preferenceId,
            //     cartId: cartId,
            //     total_payments_found: allPayments.length,
            //     from_database: false,
            //     is_current_payment: !!currentPayment
            // });
            
        } catch (error) {
            console.error("Error en getPaymentStatus:", error.message);

            if(error.message.includes("404")) {
                return res.status(404).json({
                    success: false,
                    message: "Preferencia no encontrada en Mercado Pago"
                });
            };

            if(error.message.includes("401") || error.message.includes("403")) {
                return res.status(401).json({
                    success: false,
                    message: "Error de autenticación de Mercado Pago"
                })
            }

            res.status(500).json({ 
                success: false,
                message: "Error al obtener el estado del pago",
                error: process.env.NODE_ENV === "devolpment" ? error.message : undefined
            });
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
            res.status(200).send({ message: "Pago eliminado con éxito" });
        } catch (error) {
            next(error);
        };
    };

};

export const paymentController = new PaymentController();