import React, { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./checkoutPage.css";

const backUrl = process.env.REACT_APP_BACK_URL;
// const claveMp = process.env.REACT_APP_PUBLIC_KEY_MP;

const CheckoutPage = () => {
    const { cart, total, cartId, userId } = useCart();
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState("");
    const [ preferenceId, setPreferenceId ] = useState(null);
    const [ pollingCount, setPollingCount ] = useState(0);
    const [ checkoutUrl, setCheckoutUrl ] = useState("")

    useEffect(() => {
        console.log("🔍 CheckoutPage - ESTADO COMPLETO:", {
            cartId: cartId,
            cart: cart,
            cartLength: cart.length,
            userId: userId._id,
            total: total
        });

        //El userId: userId me esta dando undefined, por eso le agregué el _id
    }, [cartId, cart, userId, total]);

    useEffect(() => {
        if(cart.length === 0) {
            navigate("/Carrito");
        } else {
            console.log("Carrito en checkout: ", cart);
        }
    }, [cart, navigate])

    const createPreference = async() => {
        setLoading(true);
        setError("");
        setPollingCount(0)
        try {
            console.log("1. Creando preferencia...");
            if(!cartId || cart.length === 0) {
                throw new Error("Carrito inválido");
            }

            const requestData = { cartId: cartId };

            console.log("2. Enviando datos al backend:", requestData);

            const response = await axios.post(`${backUrl}api/payments/create-preference`, requestData, { withCredentials: true, timeout: 15000
                    // headers: {
                    //     "Content-Type": "application/json",
                    //     "Authorization": `Bearer ${localStorage.getItem("token")}`
                    // }
                }
            );

            console.log("3. Preferencia creada");

            setPreferenceId(response.data.id);

            const mercadoPagoUrl = response.data.init_point ||
                                    response.data.sandbok_init_point ||
                                    `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${response.data.id}`;
            
            // setCheckoutUrl(url)
            // window.location.replace(mercadoPagoUrl);
            const paymentWindow = window.open(mercadoPagoUrl, "_blank");

            if(!paymentWindow) {
                alert("Por favor permite ventanas emergentes para una mejora experiencia de pago. Redirigiendo...");
                window.location.href = mercadoPagoUrl;
                return;
            }
            
            setPollingCount(1);

            const checkWindowClosed = setInterval(() => {
                if(paymentWindow.closed) {
                    clearInterval(checkWindowClosed);
                    console.log("Ventana de pago cerrada");
                    setPollingCount(prev => Math.min(prev + 1, 30))
                };
            }, 1000);
            
        } catch (error) {
            console.error("Error al crear la preferencia de pago:", error);
            let errorMessage = "Error al inicializar el pago";
            if(error.response) {
                errorMessage = error.response.data?.message || 
                `Error ${error.response.status} : ${error.response.statusText}`;
            } else if(error.request) {
                errorMessage = "No se pudo conectar con el servidor"
            }
            setError(errorMessage);

            if(error.response?.status === 401) {
                setTimeout(() => navigate("/login"), 3000);
            };

        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!preferenceId || pollingCount >= 30) return;

        const checkPaymentStatus = async() => {
            try {
                console.log(`Polling intento ${pollingCount + 1}/30 para preferecnce:`, preferenceId);
                const response = await axios.get(`${backUrl}api/payments/status/${preferenceId}`, 
                    {
                        withCredentials: true, 
                        timeout: 10000,
                        headers: {
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                const paymentStatus = response.data;                
                console.log("Estado del pago:", paymentStatus);
                
                if(paymentStatus.status === "approved") {
                    console.log("Pago aprobado - Redirigiendo a success");
                    // localStorage.setItem("lastSuccessFullPayment", JSON.stringify({
                    //     payment_id: paymentStatus.payment_id,
                    //     ticketId: paymentStatus.ticketId,
                    //     cartId: paymentStatus.external_reference || paymentStatus.cartId,
                    //     amount: paymentStatus.amount,
                    //     timestamp: Date.now()
                    // }));
                    const response = localStorage.setItem("lastSuccessFullPayment", JSON.stringify({
                        date_approved: paymentStatus.date_approved,
                        external_reference: paymentStatus.external_reference,
                        payment_id: paymentStatus.payment_id,
                        status: paymentStatus.status,
                        status_detail: paymentStatus.status_detail
                    }));

                    console.log("Respuesta de Mercado Pago:", response);                    

                    if(window.paymentWindow && !window.paymentWindow.closed) {
                        window.paymentWindow.close();
                    };

                    navigate("/payments/success", {
                        state: {
                            payment_id: paymentStatus.payment_id,
                            ticketId: paymentStatus.ticketId,
                            cartId: paymentStatus.external_reference || paymentStatus.cartId,
                            amount: paymentStatus.amount,
                            status: paymentStatus.status
                        }
                    });

                    console.log("Datos a la página de success:", navigate);
                    
                    return;

                } else if(paymentStatus.status === "rejected") {
                    console.log("Pago rechazado - Redirigiendo a failure");
                    navigate("/payments/failure", {
                        state: {
                            message: "Pago rechazado",
                            payment_id: paymentStatus.payment_id,
                            status_detail: paymentStatus.status_detail
                        }
                    });
                    return;

                } else if(paymentStatus.status === "in_process" || paymentStatus.status === "pending") {
                    console.log("Pago en proceso/pendiente - Continuando poling");
                    setPollingCount(prev => prev + 1);

                } else if(paymentStatus.status === "not_found") {
                    console.log("Pago no encontrado (usuario no completó) - Continuando polling");
                    setPollingCount(prev => prev + 1);
                } else {
                    console.log("Estado desconocido:", paymentStatus.status);
                    
                    setPollingCount(prev => prev + 1)
                };

            } catch (error) {
                console.error("Error en polling", error);
                setPollingCount(prev => prev + 1);
            };
        };

        const interval = setInterval(checkPaymentStatus, 3000);

        return () => clearInterval(interval);
    }, [preferenceId, pollingCount, navigate, backUrl]);

    if(cart.length === 0) {
        return (
            <div className="checkout-container">
                <div className="loading-checkout">
                    <p>Reedirigiendo al carrito...</p>
                </div>
            </div>
        )
    };

    return (
       <div className="checkout-container">
            <div className="checkout-header">
                <h1>Finalizar compra</h1>
                <button className="back-button" onClick={() => navigate("/Carrito")}>
                    ← Volver al carrito
                </button>
            </div>
            <div className="checkout-content">
                <div className="order-summary">
                    <h2>Resumen de tu pedido</h2>
                    <div className="order-items">
                        {cart.map(item => (
                            <div className="order-item" key={item.id}>
                                <h4>{item.title}</h4>
                                <p>Cantidad: {item.quantity}</p>
                                <p>Precio: ${(item.price).toLocaleString()}</p>
                                <p>Subtotal: ${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                    <div className="order-total">
                        <h3>Total: ${total.toLocaleString()}</h3>
                    </div>
                </div>
                <div className="payment-section">
                    <h2>Método de pago</h2>

                    {error && (
                        <div className="error-message">
                            ❌ {error}
                            <button className="error-close">x</button>
                        </div>
                    )}

                    {!preferenceId && (
                        <button className={`payment-button ${loading ? "loading" : ""}`} onClick={createPreference} disabled={loading}>
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Procesando...
                            </>
                        ) : (
                            `Pagar $${total.toLocaleString()}`
                        )}
                    </button>                        
                    )}

                    {preferenceId && checkoutUrl && (
                        <div className="checkout-iframe-container">
                            <h3>✅ Preferencia creada - Complete el pago:</h3>
                            <iframe
                                src={checkoutUrl}
                                width="100%"
                                height="600"
                                style={{border: "none", borderRadius: "8px"}}
                                title="Mercado Pago Checkout"
                                allowPaymentRequest
                            />
                            <div className="polling-status">
                                <p>⏳Esperando confirmación de pago... ({pollingCount}/10)</p>
                                <div className="loading-spinner small"></div>
                            </div>
                            <button className="cancel-button" onClick={() => setPreferenceId(null)}>
                                Cancelar y volver
                            </button>
                        </div>
                    )}
                    <div className="payment-security">
                        <p>Pago 100% seguro mediante mercado pago</p>
                    </div>
                </div>
            </div>
       </div>
    );
};

export default CheckoutPage;