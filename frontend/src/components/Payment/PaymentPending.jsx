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
        console.log("⏳ NGROK - PaymentPending - Parámetros:", {
            payment_id,
            status,
            externalReference
        });

        showPendingMessage();
        
    }, []);

    const showPendingMessage = () => {
        Swal.fire({
            position: "center",
            icon: "info",
            title: "Pago pendiente",
            html: `
                <div style= "text-align: left;">
                    <p>Tu pago esta siendo procesado.</p>
                    ${payment_id && `<p><strong>ID de transacción:</strong> ${payment_id}</p>`}
                    <p style= color: #666; margin-top: 10px;">
                        Recibiras una notificación cuando se complete la transacción.
                    </p>
                </div>
            `,
            showConfirmButton: true,
            confirmButtonText: "Entendido",
            confirmButtonColor: "#3498db"
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
                    <p className="pending-note">Te notificaremos cuando se complete el pago</p>
                    <button className="home-btn" onClick={() => navigate("/")}>
                        Volver al inicio
                    </button>
                </div>
            </div>
        </div>
    )
}