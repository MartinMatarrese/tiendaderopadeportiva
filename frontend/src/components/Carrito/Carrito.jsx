import { useState } from "react"
import { useCart } from "../Context/CartContext"
import { Link, useNavigate } from "react-router-dom"
import { ItemCarrito } from "../ItemCarrito/ItemCarrito"
import "./Carrito.css";

const Carrito = () => {
    const [buyer, setBuyer] = useState({
        Nombre:"",
        Apellido:"",
        Direccion:"",
        Email:"",
    })
    const[error, setError] = useState({
        Nombre:"",
        Apellido:"",
        Direccion:"",
        Email:"",
    })
    const {cart, clearCart, cantidadTotal, total} = useCart();
    const navigate = useNavigate();

    const handleChange = (e) =>{
        setBuyer({
            ...buyer,
            [e.target.name] : e.target.value
        })
    };

    const handleCheckout = () => {
        navigate("/checkout")
    };

    if(cantidadTotal === 0) {
        return (
            <div className="vacio">
                <h3>Tu Carrito esta vació</h3>
                <p>Descubre nuestro productos y encuentra lo que nececites</p>
                <Link to="/" className="vacio-volver">Volver a los Productos</Link>
            </div>
        )
    }
    return (
            <div className="carrito">
                <h2 className="carrito-titulo">Tu carrito de compras</h2>
                
                <div className="carrito-productos">
                    {cart.map(p => <ItemCarrito key={p.id} {...p}/>)}
                </div>

                <div className="carrito-resumen">
                    <div className="carrito-totales">
                        <p className="carrito-cantidad">Total Productos: {cantidadTotal}</p>
                        <h3 className="carrito-total">Total a pagar: ${total.toLocaleString()}</h3>
                    </div>

                    <div className="carrito-botones">
                        <button onClick={() => clearCart()} className="carrito-limpiar">Limpiar carrito</button>

                        <button className="carrito-checkout" onClick={handleCheckout}>
                            Proceder al Pago
                        </button>
                    </div>
                </div>
            </div>    
    )
}
export default Carrito;