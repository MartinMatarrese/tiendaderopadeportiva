import React, { useState } from "react";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const CheckoutPage = () => {
    const { cart, total, cartId } = useCart();
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(false);
    const [ error, setError ] = useState("");

    const handlePayment = async() => {
        setLoading(true);
        setError("");
        try {
            if(!cartId) {
                throw new Error("No hay carrito activo");
            }
            const response = await axios.post("http://localhost:8080/api/payments/create-preference", { cartId }, { withCredentials: true });
            window.location.href = response.data.init_point;
        } catch (error) {
            console.error("Error al procesar el pago: ", error);
            setError(error.response?.data?.message || "Error al inicializar el pago");
        } finally {
            setLoading(false)
        }
    };

    if(cart.length === 0) {
        navigate("/carrito");
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
            <div className="checkout content">
                <div className="order-summary">
                    <h2>Resumen de tu pedido</h2>
                    <div className="order-items">
                        {cart.map(item => {
                            <div className="order-item" key={item.id}>
                                <h4>{item.title}</h4>
                                <p>Cantidad: {item.cantidad}</p>
                                <p>Precio: ${item.price}</p>
                                <p>Subtotal: ${(item.price * item.cantidad).toLocaleString()}</p>
                            </div>
                        })}
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