import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2";

export const PaymentFailure = () => {
    const navigate = useNavigate();

    useEffect(() => {
        Swal.fire({
            position: "center",
            icon: "error",
            title: "¡Pago fallido!",
            text: "El pago no pudo ser procesado, intenta nuevamente",
            showConfirmButton: true,
            confirmButtonText: "Reintentar"
        }).then(() => {
            navigate("/checkout")
        });
    }, [navigate])

    return (
        <div className="payment-result">
            <h1>Pago fallido</h1>
            <p>Reedirigiendo al chechout...</p>
        </div>
    );
};