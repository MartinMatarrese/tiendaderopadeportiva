import { useContext } from "react"
import { Link } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import "./ItemCarrito.css";

export const ItemCarrito = ({id, title, price, cantidad }) => {   
    const {removeItem} = useContext(CartContext);

    return (
        <div className="itemcarrito">
            <h4 className="itemcarrito-titulo">{title}</h4>
            <p className="itemcarrito-precio">Precio por unidad: ${price}</p>
            <p className="itemcarrito-cantidad">Cantidad: {cantidad}</p>
            <p className="itemcarrito-subtotal">Subtotal: ${price * cantidad}</p>
            <button onClick={() => removeItem(id)} className="itemcarrito-x">X</button>
            <Link to="/" className="itemcarrito-volver">Volver a los productos</Link>
        </div>
    )
}