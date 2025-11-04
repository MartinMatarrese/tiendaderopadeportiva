import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import Swal from "sweetalert2";
import "./Payment.css";

export const PaymentFailure = () => {
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();
    const payment_id = searchParams.get("payment_id");
    const status = searchParams.get("status");
    const externalReference = searchParams.get("external_reference");
    const message = searchParams.get("message");

    useEffect(() => {
        showFailureMessage();        
    }, [message, payment_id, status, externalReference])

    const getFailureMessage = () => {
        if(message) {
            switch(message) {
                case "pago_rechazado":
                    return {
                        title: "Pago rechazado",
                        text: "Tu pago fue rechazado por Mercado Pago. Por favor verifica los datos de tu tarjeta o intenta con otro método de pago."
                    };
                case "pago_cancelado":
                    return {
                        title: "Pago cancelado",
                        text: "Has cancelado el proceso de pago. Puedes intentarlo nuevamente cuando lo desees."
                    };
                case "stock_insuficiente":
                    return {
                        title: "Stock insuficiente",
                        text: "Algunos productos de tu carrito ya no tienen stock disponible. Por favor, revisa tu carrito."
                    };
                case "error_procesando_pago":
                    return {
                        title: "Error procesando pago",
                        text: "Ocurrio un error al procesar tu pago. Por favor intenta nuevamente."
                    };
                default:
                    return {
                        title: "Pago fallid",
                        text: "No pudimos procesar tu pago. Puedes intentar con otro método de pago"
                    };
            };
        };

        if(payment_id === "null" || status === "null") {
            return {
                title: "Pago rechazado",
                text: "Tu pago fue rechazado por Mercado Pago. Verifica los datos de tu tarjeta o intenta con otro método de pago"
            };
        };

        return {
            title: "¡Pago Fallido!",
            text: "No pudimos procesar tu pago. Puedes intentar con otro método de pago."
        };
    };

    const showFailureMessage = () => {
        const failureInfo = getFailureMessage();
        Swal.fire({
            position: "center",
            icon: "error",
            title: failureInfo.title,
            html: `
                <div style="text-align: left;">
                    <p>${failureInfo.text}</p>
                    ${payment_id && payment_id !== "null" && `<p><strong>ID de transacción:</strong> ${payment_id}</p>`}
                    ${externalReference && externalReference !== "null" && `<p><strong>Referencia:</strong> ${externalReference}</p>`}
                    <p style= "color: #666; margin-top: 10px;">
                        Si el problema persiste contacta con soporte.
                    </p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: "Reintentar pago",
            showCancelButton: true,
            cancelButtonText: "Volver al carrito",
            confirmButtonColor: "#e53935",
            cancelButtonColor: "#6c757d"
        }).then((result) => {
            if(result.isConfirmed) {
                navigate("/checkout")
            } else {
                navigate("/Carrito")
            };
        });
    };

    return (
        <div className="payment-result failure">
            <div className="payment-container">
                <div className="payment-status">
                    <div className="failure-icon">❌</div>
                    <h1>Pago fallido</h1>
                    <p>No se pudo completar la transacción</p>
                    <div className="action-buttons">
                        <button className="retry-btn" onClick={() => navigate("/checkout")}>
                            Reintentar Pago
                        </button>
                        <button className="cart-btn" onClick={() => navigate("/Carrito")}>
                            Volver al carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};