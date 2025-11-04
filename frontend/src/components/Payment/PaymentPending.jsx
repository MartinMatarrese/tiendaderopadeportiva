import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import Swal from "sweetalert2";
import "./Payment.css";

export const PaymentPending = () => {
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();
    const payment_id = searchParams.get("payment_id");
    const status = searchParams.get("status");
    const externalReference = searchParams.get("external_reference");

    useEffect(() => {
        console.log("⏳ PaymentPending - Parámetros:", {
            payment_id,
            status,
            externalReference
        });

        showPendingMessage();
        
    }, [payment_id, status, externalReference]);

    const showPendingMessage = () => {
        Swal.fire({
            position: "center",
            icon: "info",
            title: "Pago pendiente",
            html: `
                <div style= text-align: left;">
                    <p>Tu pago está siendo procesado.</p>
                    ${payment_id && payment_id !== "null" ? `<p><strong>ID de transacción:</strong> ${payment_id}</p>` : ""}
                    ${externalReference && externalReference !== "null" ? `<p><strong>Referencia:</strong> ${externalReference}</p>` : ""}
                    <p style="color: #666; margin-top: 10px;">
                        Recibirás una notificación cuando se complete la transacción.
                    </p>
                    <p style="color: #f39c12; font-size: 0.9rem; margin-top: 10px;">
                        ⚠️ Este proceso puede tomar algunos minutos
                    </p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: "Entendido",
            confirmButtonColor: "#3498db",
            allowOutsideClick: false
        }).then(() => {
            navigate("/");
        });
    };

    return(
        <div className="payment-result pending">
            <div className="payment-container">
                <div className="payment-status">
                    <div className="pending-icon">⏳</div>
                    <h1>Pago pendiente</h1>
                    <p>Tu transacción está en proceso</p>
                    {(payment_id && payment_id !== "null") && (
                        <div className="payment-details">
                            <p><strong>ID de transacción:</strong> {payment_id}</p>
                        </div>
                    )}
                    <p className="pending-note">Te notificaremos cuando se complete el pago</p>
                    <button className="home-btn" onClick={() => navigate("/")}>
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    )
}