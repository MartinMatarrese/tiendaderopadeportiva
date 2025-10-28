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

    useEffect(() => {
        console.log("❌ NGROK - PaymentFailure - Parámetros:", {
            payment_id,
            status,
            externalReference
        });

        showFailureMessage();
        
    }, [])

    const showFailureMessage = () => {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "¡Pago fallido!",
                html: `
                    <div style="text-align: left;">
                        <p>No pudimos procesar tu pago.</p>
                        ${payment_id && `<p><strong>ID de transacción:</strong> ${payment_id}</p>`}
                        <p style= "color: #666; margin-top: 10px;">
                            Puedes intentar con otro método de pago.
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