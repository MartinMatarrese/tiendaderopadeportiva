import { useContext } from "react";
import "./CartWidget.css";
import { CartContext } from "../Context/CartContext";
import { Link } from "react-router-dom";
import carrito from "../../image/carrito.png";

export const CartWidget = () => {
    
    const {cantidadTotal} = useContext(CartContext)
    
    return <div className="cart">
        <Link to="/Carrito">
            <img className="img-cart" src={carrito} alt="carrito"/>
            <p className="p-cart">{cantidadTotal > 0 && <span>{cantidadTotal}</span>}</p>
        </Link>
    </div>
}