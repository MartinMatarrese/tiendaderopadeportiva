import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./checkoutPage.css";

const CheckoutPage = () => {
    const { cart, total, cartId } = useCart();
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState("");

    console.log("Carrito en checkout: ", cart);
    

    const handlePayment = async() => {
        setLoading(true);
        setError("");
        try {
            console.log("1. Verificando carrito...");
            
            if(!cartId) {
                throw new Error("No hay carrito activo");
            }

            if(cart.length === 0) {
                throw new Error("El carrito esta vacio");
            }

            const requestData = {
                cartId: cartId,
                cart: {
                    products: cart.map(item => ({
                        id_prod: {
                            title: item.title,
                            price: item.price
                        },
                        quantity: item.quantity
                    }))
                }
            };

            console.log("2. Enviando datos al backend:", requestData);
            
            const response = await axios.post("http://localhost:8080/api/payments/create-preference", requestData, { withCredentials: true });
            console.log("3. Respuesta del backend:", response.data);
            const paymentUrl = response.data.sandbox_init_point || response.data.init_point;
            console.log("4. Url de pago obtenida...", paymentUrl);
            
            if(paymentUrl) {
                console.log("5. Abriendo Mercado Pago en nueva pestaña");
                
            //     window.location.href = response.data.init_point;    
            // } else if(response.data.sandbox_init_point) {
            //     window.location.href = response.data.sandbox_init_point;
                // window.open(paymentUrl, "_blank")
                const link = document.createElement("a");
                link.href = paymentUrl;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                console.log("6. Pestaña abierta - completar pago en Mercado Pago");
                
            } else {
                throw new Error("No se pudo obtener la url del pago de la respuesta")
            }
            
            // window.location.href = response.data.init_point;
        } catch (error) {
            console.error("Error al procesar el pago: ", error);
            setError(error.response?.data?.message || "Error al inicializar el pago");
        } finally {
            setLoading(false)
        }
    };

    if(cart.length === 0) {
        navigate("/Carrito");
        return null;
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
                            {error}
                        </div>
                    )}

                    <button className="payment-button" onClick={handlePayment} disabled={loading}>
                        {loading ? "Procesando..." : `Pagar $${total.toLocaleString()}`}
                    </button>
                    <div className="payment-security">
                        <p>Pago 100% seguro mediante mercado pago</p>
                    </div>
                </div>
            </div>
       </div>
    );
};

export default CheckoutPage;