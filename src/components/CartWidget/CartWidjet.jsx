import { useContext } from "react";
import "./CartWidget.css";
import { CartContext } from "../Context/CartContext";
import { Link } from "react-router-dom";

export const CartWidget = () => {
    
    const {cantidadTotal} = useContext(CartContext)
    
    return <div className="cart">
        <Link to="/Carrito">
            <img className="img-cart" src="https://w7.pngwing.com/pngs/618/1013/png-transparent-shopping-cart-online-shopping-empty-cart-angle-logo-shopping-centre.png" alt="carrito"/>
            <p className="p-cart">{cantidadTotal > 0 && <span>{cantidadTotal}</span>}</p>
        </Link>
    </div>
}