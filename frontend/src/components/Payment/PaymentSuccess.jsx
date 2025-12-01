import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Payment.css";

export const PaymentSuccess = () => {
    const navigate = useNavigate();
    // const [ searchParams ] = useSearchParams()
    const [ processing, setProcessing ] = useState(true);
    const [ paymentData, setPaymentData ] = useState(null);
    // const payment_id = searchParams.get("payment_id");
    // const externalReference = searchParams.get("external_reference");
    // const ticketId = searchParams.get("ticketId")
    const getUrlParams = () => {
        const currentUrl = window.location.href;
        console.log("URL Completa:", currentUrl);

        const urlParams = new URLSearchParams(window.location.search);
        
        return {
            payment_id: urlParams.get("payment_id") || urlParams.get("collection_id"),
            external_reference: urlParams.get("external_reference"),
            status: urlParams.get("status") || urlParams.get("collection_status"),
            ticketId: urlParams.get("ticket"),
            merchant_order_id: urlParams.get("marchant_order_id")
        }
    }

    useEffect(() => {
        proccessPayment();
    }, []);

    const showSuccessMessage = (paymentId, ticketId) => {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "¡Pago Exitoso!",
            html: `
                <div style="text-align: center;">
                    <p>Tu compra ha sido procesada correctamente</p>
                    <p><strong>ID de transacción:</strong></p>
                    <p style="color: #e53935; font-weight: bold; font-size: 1.1em;">${paymentId}</p>
                    ${ticketId ? `
                        <p><strong>Número de orden:</strong></p>
                        <p style= "color: #2d3748; font-weigth: bold; font-size: 1.1em;">${ticketId}</p>` : ""}
                    <p style="margin-top: 15px; color: #666; font-size: 0.9em;">
                        Recibirás un email de confirmación en breve.
                    </p>
                    <p style="color: #38a169; font-size: 0.8em; margin-top: 10px;">
                        ✅ El pago ya fue procesado en nuestro sistema
                    </p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: "Continuar comprando",
            confirmButtonColor: "#e53935",
            width: 500
        }).then(() => {
            navigate("/");
        });
    };

    const showGenricSuccess = () => {
        Swal.fire({
            position: "center",
            icon: "success",
            title: "¡Pago Exitoso!",
            html: `
                <div style="text-align: center;">
                    <p>Tu pago fue procesado correctamente</p>
                    <p style="color: #666; margin-top: 10px;">
                        Gracias por tu compra. Recibirás un email de confirmación.
                    </p>
                    <p style="color: #38a169; font-size: 0.8em; margin-top: 10px;">
                        ✅ Transacción completada exitosamente
                    </p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: "Volver al inicio",
            confirmButtonColor: "#e53935",
        }).then(() => {
            navigate("/");
        });
    }


    const proccessPayment = async() => {
        try {
            setProcessing(true);
            console.log("Procesando pago exitoso:", { payment_id, externalReference, ticketId});

            await new Promise(resolve => setTimeout(resolve, 2000));

            setPaymentData({
                paymentId: payment_id,
                ticketId: ticketId
            })

            if(payment_id) {
                showSuccessMessage(payment_id, ticketId);
            } else {
                showGenricSuccess();
            }

        } catch (error) {
            console.error("Error en confirmación:", error);
            showGenricSuccess();
        } finally {
            setProcessing(false);
        };
    };

    if(processing) {
        return (
            <div className="payment-result success">
                <div className="payment-container">
                    <div className="processing-payment">
                        <div className="loading-spinner large"></div>
                        <h1>Confirmando pago...</h1>
                        <p>Estamos procesando tu transacción</p>
                        {payment_id && (
                            <div className="payment-details">
                                <p><strong>ID de transacción:</strong> {payment_id}</p>
                            </div>
                        )}
                        {ticketId && (
                            <div className="payment-details">
                                <p><strong>Número de orden:</strong> {ticketId}</p>
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
                    {paymentData?.payment_id && (
                        <div className="payment-summary">
                            <div className="summary-item">
                                <span>ID de transacción:</span>
                                <strong>{paymentData.payment_id}</strong>
                            </div>
                            {paymentData.ticketId && (
                                <div className="summary-item">
                                    <span>Número de orden:</span>
                                    <span>{paymentData.ticketId}</span>
                                </div>
                            )}
                        </div>
                    )}
                    <button className="continue-shhoping-btn" onClick={() => navigate("/")}>
                        Continuar comprando
                    </button>
                </div>
            </div>
        </div>
    );
};