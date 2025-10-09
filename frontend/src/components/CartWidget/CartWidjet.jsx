import "./CartWidget.css";
import { useCart } from "../Context/CartContext";
import { Link } from "react-router-dom";
import carrito from "../../image/shopping-cart.svg";

export const CartWidget = () => {    
    const { getTotalQuantity } = useCart()
    const totalQuantity = getTotalQuantity();
    
    return <div className="cart">
        <Link to="/Carrito">
            <img className="img-cart" src={carrito} alt="carrito"/>
            <p className="p-cart">{totalQuantity > 0 && <span>{totalQuantity}</span>}</p>
        </Link>
    </div>
}