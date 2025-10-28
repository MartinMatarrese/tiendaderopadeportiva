import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./Payment.css";

const backUrl = process.env.REACT_APP_BACK_URL;

export const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams()
    const [ processing, setProcessing ] = useState(true);
    const payment_id = searchParams.get("payment_id");
    const externalReference = searchParams.get("external_reference");
    const ticketId = searchParams.get("ticketId")

    useEffect(() => {
        console.log("NGROK - PaymentSuccess - Parámetros:", {
            payment_id,
            externalReference,
            ticketId
        });
        proccessPayment();
    }, []);

    const showSuccessMessage = (paymentId) => {
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

            const paymentId = payment_id
            const cartId = externalReference;

            console.log("Procesando pago exitoso:", {paymentId, cartId});

            await new Promise(resolve => setTimeout(resolve, 2000));

            if(!paymentId) {
                console.warn("No hay ID de pago - Mostrando mensage genérico");
                showGenricSuccess();
                return;
            };

            showSuccessMessage(paymentId);

        } catch (error) {
            console.error("Error en confirmación:", error);
            showGenricSuccess();
        } finally {
            setProcessing(false);
        };
    };

    return (
        <div className="payment-result success">
            <div className="payment-container">
                {processing ? (
                    <div className="processing-payment">
                        <div className="loading-spinner large"></div>
                        <h1>Confirmando pago...</h1>
                        <p>Estamos processando tu transacción</p>
                        {payment_id && (
                            <div className="payment-details">
                                <p><strong>ID de transacción:</strong> {payment_id}</p>
                            </div>
                        )}
                        {ticketId && (
                            <div className="payments-details">
                                <p><strong>Número de ordern:</strong> {ticketId}</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="payment-complete">
                        <div className="success-icon">✅</div>
                        <h1>¡Gracias por tu compra!</h1>
                        <p>Tu pedido ha sido confirmado exitosamente</p>
                        {(payment_id) && (
                            <div className="payment-summary">
                                <div className="summary-item">
                                    <span>ID de transacción:</span>
                                    <strong>{payment_id}</strong>
                                </div>
                                {ticketId && (
                                    <div className="summary-item">
                                        <span>Número de orden:</span>
                                        <span>{ticketId}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        <button className="continue-shhoping-btn" onClick={() => navigate("/")}>
                            Continuar comprando
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};