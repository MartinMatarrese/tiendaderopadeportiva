import React, { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./checkoutPage.css";

const backUrl = process.env.REACT_APP_BACK_URL;
const claveMp = process.env.REACT_APP_PUBLIC_KEY_MP;

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
            userId: userId,
            total: total
        });
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

            const response = await axios.post(`${backUrl}api/payments/create-preference`, requestData, {withCredentials: true, timeout: 15000});

            console.log("3. Preferencia creada");

            setPreferenceId(response.data.id);

            const url = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${response.data.id}`;
            
            setCheckoutUrl(url)
            
        } catch (error) {
            console.error("Error al crear la preferencia de pago:", error);
            setError(error.response?.data?.message || "Error al inicarlizar el pago");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!preferenceId || pollingCount >= 60) return;

        const checkPaymentStatus = async() => {
            try {
                console.log(`Polling intento ${pollingCount + 1} para preferecnce:`, preferenceId);
                const response = await axios.get(`${backUrl}api/payments/status/${preferenceId}`, {withCredentials: true, timeout: 10000});

                const paymentStatus = response.data;                
                console.log("Estado del pago:", paymentStatus);
                
                if(paymentStatus.status === "approved") {
                    console.log("Pago aprobado - Redirigiendo a success");
                    navigate("/payments/success", {
                        state: {
                            payment_id: paymentStatus.payment_id,
                            external_reference: paymentStatus.external_reference,
                            status: paymentStatus.status
                        }
                    });

                } else if(paymentStatus.status === "rejected") {
                    console.log("Pago rechazado - Redirigiendo a failure");
                    navigate("/payments/failure", {
                        state: {
                            message: "Pago rechazado",
                            payment_id: paymentStatus.payment_id,
                            status_detail: paymentStatus.status_detail
                        }
                    });

                } else if(paymentStatus.status === "in_process") {
                    console.log("Pago en proceso - Continuando poling");
                    setPollingCount(prev => prev + 1);

                } else if(paymentStatus.status === "pending") {
                    console.log("Pago pendiente - reedirigiendo a pending");
                    navigate("/payments/pending", {
                        state: {
                            payment_id: paymentStatus.payment_id,
                            external_reference: paymentStatus.external_reference
                        }
                    });
                } else {
                    setPollingCount(prev => prev + 1)
                };

            } catch (error) {
                console.error("Error en polling", error);
                setPollingCount(prev => prev + 1);
            };
        };

        const interval = setInterval(() => {
            checkPaymentStatus()
        }, 5000);

        if(pollingCount >= 60) {
            clearInterval(interval);
            console.log("Polling timeout - Máximo de intentos alcanzado");
            setError("Tiempo de espera agotado. Verifica el estado de tu pago");
        };

        return () => clearInterval(interval);
    }, [preferenceId, pollingCount, navigate]);    

    // useEffect(() => {
    //     const loadMercadoPagoSDK = () => {
    //         return new Promise((resolve) => {
    //             if(window.MercadoPago) {
    //                 console.log("✅ SDK ya cargado");
    //                 const mp = new window.MercadoPago(claveMp, {
    //                     locale: "es-AR"
    //                 });
    //                 window.mp = mp;
    //                 resolve();
    //                 return;
    //             };

    //             const script = document.createElement("script");
    //             script.src = "https://sdk.mercadopago.com/js/v2";
    //             script.onload = () => {
    //                 const mp = new window.MercadoPago(claveMp, {
    //                     locale: "es-AR"
    //                 });
    //                 window.mp = mp;
    //                 console.log("✅ MercadoPago instance creada");
    //                 resolve();
    //             };
    //             script.onerror = () => {
    //                 console.error("Error cargando SDK de Mercado Pago");
    //                 setError("Error al cargar el sistema de pagp")
    //                 resolve();
    //             };
    //             document.body.appendChild(script);
    //         });
    //     };

    //     loadMercadoPagoSDK().catch(error => {
    //         console.error("Error en carga SDK:", error);
    //     });
    // }, []);

    // const initializeCheckout = async() => {
    //     try {
    //         console.log("🎯 Inicializando checkout embebido...");
    //         console.log("🔍 preferenceId:", preferenceId);
    //         console.log("🔍 window.mp:", window.mp);
    //         console.log("🔍 checkoutContainerRef:", checkoutContainerRef.current);
    //         if(!window.mp) {
    //             console.error("❌ MercadoPago SDK no se esta cargando");
    //             setError("Error: SDK de pago, no cargado");
    //             return;
    //         };

    //         if (!checkoutContainerRef.current) {
    //             console.error("❌ Contenedor del checkout no encontrado");
    //             return;
    //         };

    //         checkoutContainerRef.current.innerHTML = "<p>🔄 Inicializando checkout...</p>";
    //         console.log("🚀 Creando bricks builder...");
    //         console.log("✅ Bricks builder creado");

    //         console.log("🚀 Creando wallet brick...");
    //         const bricksBuilder = await window.mp.bricks();
    //         await bricksBuilder.create("Wallet", "checkout-container", {
    //             initialization: {
    //                 preferenceId: preferenceId
    //             },
    //             customization: {
    //                 visual: {
    //                     style: {
    //                         theme: "default"
    //                     }
    //                 }
    //             },
    //             callbacks: {
    //                 onReady: () => {
    //                     console.log("✅ Checkout embebido listo y renderizado");
    //                     setError("");
    //                 },
    //                 onError: (error) => {
    //                     console.error("❌ Error en checkout:", error);
    //                     setError("Error en el sistema de pago: " + error.message);
    //                     checkoutContainerRef.current.innerHTML = 
    //                         '<p style="color: red;">❌ Error cargando el método de pago</p>';
    //                 }
    //             }
    //         });

    //         console.log("✅ Checkout inicialización completada");
                        
    //     } catch (error) {
    //         console.error("❌ Error inicializando checkout:", error);
    //         setError("Error al inicializar el pago: " + error.message);
    //         if (checkoutContainerRef.current) {
    //             checkoutContainerRef.current.innerHTML = 
    //                 '<p style="color: red;">❌ Error: ' + error.message + '</p>';
    //         };
    //     };
    // };

    // useEffect(() => {
    //     if(preferenceId && window.mp && checkoutContainerRef.current) {
    //         initializeCheckout();
    //     }
    // }, [preferenceId]);

    // const handlePaymentInit = () => {
    //     createPreference();
    // }

    // const handlePaymentSuccess = () => {
    //     console.log("Pago completado exitosamente");
    //     navigate("")        
    // }

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