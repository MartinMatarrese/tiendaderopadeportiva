import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Payment.css";

export const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    // const [ searchParams ] = useSearchParams()
    const [ processing, setProcessing ] = useState(true);
    const [ paymentData, setPaymentData ] = useState(null);
    // const payment_id = searchParams.get("payment_id");
    // const externalReference = searchParams.get("external_reference");
    // const ticketId = searchParams.get("ticketId")
    
    useEffect(() => {
        console.log("PaymentSuccess montado");
        console.log("location.state:", location.state);
        console.log("location.search:", location.search);

        const getPaymentData = () => {
            if(location.state) {
                console.log("Datos del state:", location.state);
                return location.state;                
            }

            const savedPayment = localStorage.getItem("lastSuccessFullPayment");
            if(savedPayment) {
                try {
                    const pased = JSON.parse(savedPayment);
                    console.log("Datos de localStorage:", pased);
                    localStorage.removeItem("lastSuccessFullPayment");
                    return pased;                    
                } catch (error) {
                    console.error("Error parseando localStorage:", error);                    
                };
            };

            const urlParams = new URLSearchParams(window.location.search);
            const params = {
                paymentId: urlParams.get("payment_id") || urlParams.get("collection_id"),
                external_reference: urlParams.get("external_reference"),
                status: urlParams.get("status") || urlParams.get("collection_status"),
                merchant_order_id: urlParams.get("merchant_order_id"),
                ticketId: urlParams.get("ticketId")
            };

            if(params.payment_id) {
                console.log("Datos de query params:", params);
                return params;                
            };
            
            return null;
        };

        const showSuccessMessage = (paymentData) => {
            if(!paymentData) {
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "¡Pago Exitoso!",
                    html: `
                        <div style="text-align: center;">
                            <p>Tu compra ha sido procesada correctamente</p>
                            <p style="margin-top: 10px; color: #666;">
                                Gracias por tu compra. Recibirás un email de confirmación.
                            </p>
                        </div>
                    `,
                    showConfirmButton: true,
                    confirmButtonText: "Aceptar",
                    confirmButtonColor: "#e53935",
                });

                return;
            };

            Swal.fire({
                position: "center",
                icon: "success",
                title: "¡Pago Exitoso!",
                html: `
                    <div style="text-align: center;">
                        <p>Tu compra ha sido procesada correctamente</p>
                        ${paymentData.payment_id ? `
                            <p><strong>ID de transacción:</strong></p>
                            <p style="color: #e53935; font-weight: bold; font-size: 1.1em;">${paymentData.payment_id}</p>
                        `: ""}
                        ${paymentData.ticketId ? `
                            <p><strong>Número de orden:</strong></p>
                            <p style= "color: #2d3748; font-weigth: bold; font-size: 1.1em;">${paymentData.ticketId}</p>
                        ` : ""}
                        ${paymentData.external_reference ? `
                            <p><strong>Referencia:</strong> ${paymentData.external_reference}</p>
                        ` : ""}
                        <p style="margin-top: 15px; color: #666; font-size: 0.9em;">
                            Recibirás un email de confirmación en breve.
                        </p>
                        <p style="color: #38a169; font-size: 0.8em; margin-top: 10px;">
                            ✅ El pago ya fue procesado en nuestro sistema
                        </p>
                    </div>
                `,
                showConfirmButton: true,
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#e53935",
                width: 500
            });
        };

        const proccessPayment = async() => {
            try {
                setProcessing(true);
        
                const data = getPaymentData();
                console.log("Datos obtenidos para mostrar:", data);

                setPaymentData(data)

                await new Promise(resolve => setTimeout(resolve, 1000));
                showSuccessMessage(data);

            } catch (error) {
                console.error("Error en confirmación:", error);
            } finally {
                setProcessing(false);
            };
        };

        proccessPayment();
        
    }, [navigate, location]);

    // useEffect(() => {
    //     const getUrlParams = () => {
    //         const currentUrl = window.location.href;
    //         console.log("URL Completa:", currentUrl);

    //         const urlParams = new URLSearchParams(window.location.search);
        
    //         return {
    //             payment_id: urlParams.get("payment_id") || urlParams.get("collection_id"),
    //             external_reference: urlParams.get("external_reference"),
    //             status: urlParams.get("status") || urlParams.get("collection_status"),
    //             // ticketId: urlParams.get("ticket"),
    //             merchant_order_id: urlParams.get("merchant_order_id")
    //         }
    //     }

    //     const showSuccessMessage = (paymentId, ticketId) => {
    //         Swal.fire({
    //             position: "center",
    //             icon: "success",
    //             title: "¡Pago Exitoso!",
    //             html: `
    //                 <div style="text-align: center;">
    //                     <p>Tu compra ha sido procesada correctamente</p>
    //                     <p><strong>ID de transacción:</strong></p>
    //                     <p style="color: #e53935; font-weight: bold; font-size: 1.1em;">${paymentId}</p>
    //                     ${ticketId ? `
    //                         <p><strong>Número de orden:</strong></p>
    //                         <p style= "color: #2d3748; font-weigth: bold; font-size: 1.1em;">${ticketId}</p>` : ""}
    //                     <p style="margin-top: 15px; color: #666; font-size: 0.9em;">
    //                         Recibirás un email de confirmación en breve.
    //                     </p>
    //                     <p style="color: #38a169; font-size: 0.8em; margin-top: 10px;">
    //                         ✅ El pago ya fue procesado en nuestro sistema
    //                     </p>
    //                 </div>
    //             `,
    //             showConfirmButton: true,
    //             confirmButtonText: "Aceptar",
    //             confirmButtonColor: "#e53935",
    //             width: 500
    //         });
    //     };

    //     const showGenricSuccess = () => {
    //         Swal.fire({
    //             position: "center",
    //             icon: "success",
    //             title: "¡Pago Exitoso!",
    //             html: `
    //                 <div style="text-align: center;">
    //                     <p>Tu pago fue procesado correctamente</p>
    //                     <p style="color: #666; margin-top: 10px;">
    //                         Gracias por tu compra. Recibirás un email de confirmación.
    //                     </p>
    //                     <p style="color: #38a169; font-size: 0.8em; margin-top: 10px;">
    //                         ✅ Transacción completada exitosamente
    //                     </p>
    //                 </div>
    //             `,
    //             showConfirmButton: true,
    //             confirmButtonText: "Aceptar",
    //             confirmButtonColor: "#e53935",
    //         });
    //     }
        
    //     const proccessPayment = async() => {
    //         try {
    //             setProcessing(true);
    //             // console.log("Procesando pago exitoso:", { payment_id, externalReference, ticketId});
    //             const params = getUrlParams();
    //             console.log("Parámetros recibidos de mercado pago:", params);

    //             await new Promise(resolve => setTimeout(resolve, 2000));

    //             setPaymentData({
    //                 external_reference: params.external_reference,
    //                 merchant_order_id: params.merchant_order_id,
    //                 payment_id: params.payment_id,
    //                 status: params.status
    //             })
                
    //             if(params.payment_id) {
    //                 showSuccessMessage(params.payment_id, params.ticketId);
    //             } else {
    //                 showGenricSuccess();
    //             }

    //         } catch (error) {
    //             console.error("Error en confirmación:", error);
    //             showGenricSuccess();
    //         } finally {
    //             setProcessing(false);
    //         };
    //     };
    //     proccessPayment();
    // }, [navigate]);

    useEffect(() => {
        localStorage.removeItem("cart");
        localStorage.removeItem("cartId");
        localStorage.removeItem("cartItems");
    }, []);

    // const getUrlParamsForRender = () => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     return {
    //         payment_id: urlParams.get("payment_id") || urlParams.get("collection_id"),
    //         external_reference: urlParams.get("external_reference"),
    //         status: urlParams.get("status") || urlParams.get("collection_status"),
    //         // ticketId: urlParams.get("ticket"),
    //         merchant_order_id: urlParams.get("marchant_order_id")
    //     }
    // }

    if(processing) {
        // const params = getUrlParamsForRender();
        return (
            <div className="payment-result success">
                <div className="payment-container">
                    <div className="processing-payment">
                        <div className="loading-spinner large"></div>
                        <h1>Confirmando pago...</h1>
                        <p>Estamos procesando tu transacción</p>
                        {paymentData?.payment_id && (
                            <div className="payment-details">
                                <p><strong>ID de transacción:</strong> {paymentData.payment_id}</p>
                            </div>
                        )}
                        {paymentData?.ticketId && (
                            <div className="payment-details">
                                <p><strong>Número de orden:</strong> {paymentData.ticketId}</p>
                            </div>
                        )}
                        {paymentData?.external_reference && (
                            <div className="payment-details">
                                <p><strong>Referencia:</strong> {paymentData.external_reference}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="payment-result success">
            <div className="payment-container">
                <div className="payment-complete">
                    <div className="success-icon">✅</div>
                    <h1>¡Gracias por tu compra!</h1>
                    <p>Tu pedido ha sido confirmado exitosamente</p>
                    {paymentData && (
                        <div className="payment-summary">
                            {paymentData.payment_id && (
                                <div className="summary-item">
                                    <span>ID de transacción:</span>
                                    <strong>{paymentData.payment_id}</strong>
                                </div>
                            )}
                            {paymentData.ticketId && (
                                <div className="summary-item">
                                    <span>Número de orden:</span>
                                    <span>{paymentData.ticketId}</span>
                                </div>
                            )}
                            {paymentData.external_reference && (
                                <div className="summary-item">
                                    <span>Referencia:</span>
                                    <span>{paymentData.external_reference}</span>
                                </div>
                            )}
                            {paymentData.amount && (
                                <div className="summary-item">
                                    <span>Total:</span>
                                    <span>{paymentData.amount.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* {paymentData?.paymentId && (
                        <div className="payment-summary">
                            <div className="summary-item">
                                <span>ID de transacción:</span>
                                <strong>{paymentData.paymentId}</strong>
                            </div>
                            {paymentData.ticketId && (
                                <div className="summary-item">
                                    <span>Número de orden:</span>
                                    <span>{paymentData.ticketId}</span>
                                </div>
                            )}
                        </div>
                    )} */}
                    <button className="continue-shhoping-btn" onClick={() => navigate("/")}>
                        Continuar comprando
                    </button>
                </div>
            </div>
        </div>
    );
};