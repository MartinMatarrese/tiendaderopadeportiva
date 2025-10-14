import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

export const PaymentPending = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate("/")
        }, 5000);
    }, [navigate]);

    return(
        <div className="payment-result">
            <h1>Pago pendiente</h1>
            <p>Tu pago esta siendo procesado. Te notificaremos cuando se complete.</p>
            <p>Reedirigiendo a la página principal...</p>
        </div>
    )
}