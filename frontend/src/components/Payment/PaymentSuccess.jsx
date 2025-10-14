import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import "./Payment.css";
// import axios from "axios";

export const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams()
    // const location = useLocation();
    const collection_id = searchParams.get("collection_id");
    const collection_status = searchParams.get("collection_status");
    const payment_id = searchParams.get("payment_id");
    const status = searchParams.get("status");
    // const cartId = searchParams.get("cartId");
    const externalReference = searchParams.get("external_reference");
    const preference_id = searchParams.get("preference_id");
    // const ticketId = searchParams.get("ticketId");

    useEffect(() => {
        if(payment_id && status === "approved") {
            console.log("Pago exitoso desde MP:", {payment_id, externalReference, status});
            Swal.fire({
                position: "center",
                icon: "success",
                title: "¡Pago exitoso!",
                html: `
                        <p>Tu compra a sido procesada correctamente</p>
                        <p><strong>Id de pago:</strong>${payment_id}</P>
                    `,
                showConfirmButton: true,
                confirmButtonText: "Continuar comprando"
            }).then(() => {
                    navigate("/");
            })    
        } else {
            navigate("/")
        }
        // const processSuccess = async() => {
        //     try {
        //         if(payment_id && cartId) {
        //             Swal.fire({
        //                 position: "center",
        //                 icon: "success",
        //                 title: "¡Pago exitoso!",
        //                 html: `
        //                         <p>Tu compra a sido procesada correctamente</p>
        //                         <p><strong>Id de pago:</strong>${payment_id}</P>
        //                         ${ticketId ? `<p><strong>Número de Ticket:</strong>${ticketId}</p>` : ""}
        //                     `,
        //                 showConfirmButton: true,
        //                 confirmButtonText: "Continuar comprando"
        //             }).then(() => {
        //                 navigate("/");
        //             })    
        //         } else {
        //             Swal.fire({
        //                 position: "center",
        //                 icon: "warning",
        //                 title: "¡Información incompleta!",
        //                 text: "No se pudo procesar la confirmación del pago",
        //                 confirmButtonText: "Volver al inicio"
        //             }).then(() => {
        //                 navigate("/");
        //             })        
        //         }
        //         // const response = await axios.post("http://localhost:8080/api/payments/success", {
        //         //     params: {
        //         //         payment_id: payment_id || externalReference,
        //         //         status: status || "approverd",
        //         //         cartId: cartId
        //         //     },
        //         //     withCredentials: true
        //         // });
        //         // Swal.fire({
        //         //     position: "center",
        //         //     icon: "success",
        //         //     title: "¡Pago exitoso!",
        //         //     html: `
        //         //     <p>Tu compra a sido procesada correctamente</p>
        //         //     <p><strong>Número de pedido:</strong> ${response.data.ticket?.code || "N/A"}</P>
        //         //     `,
        //         //     showConfirmButton: true,
        //         //     confirmButtonText: "Continuar comprando"
        //         // }).then(() => {
        //         //     navigate("/");
        //         // })
        //     } catch (error) {
        //         Swal.fire({
        //             position: "center",
        //             icon: "error",
        //             title: "¡Error al confirmar el pago!",
        //             text: error.response?.data?.message || "Conecta con sopoerte",
        //             confirmButtonText: "Aceptar"
        //         });
        //  }
        // }

        // if(cartId) {
        //     confirmPayment()
        // } else {
        //     Swal.fire({
        //         position: "center",
        //         icon: "warning",
        //         title: "¡Información incompleta!",
        //         text: "No se pudo procesar la confirmación del pago",
        //         confirmButtonText: "Volver al inicio"
        //     }).then(() => {
        //         navigate("/");
        //     })
        // }
        // processSuccess();
    }, [payment_id, externalReference, status, navigate]);

    return (
        <div className="payment-result">
            <div className="success-animation">
                <h1>¡Gracias por su compra!</h1>
                <p>Tu pedido a sido confirmado y esta siendo procesado.</p>
                {payment_id && <p className="payment-id">ID de la transacción: {payment_id}</p>}
                {/* {ticketId && <p className="ticket-id">N° de pedido: {ticketId}</p>} */}
            </div>
        </div>
    );
};