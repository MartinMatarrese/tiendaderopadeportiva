import { Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import "./ItemCarrito.css";

export const ItemCarrito = ({id, title, price, quantity, image }) => {   
    const { removeItem } = useCart();

    return (
        <div className="itemcarrito">
            <img src={image} alt={title} className="itemcarrito-imagen"/>
            <div className="itemcarrito-info">
                <h4 className="itemcarrito-titulo">{title}</h4>
                <p className="itemcarrito-precio">Precio por unidad: ${price.toLocaleString()}</p>
                <p className="itemcarrito-cantidad">Cantidad: {quantity}</p>
                <p className="itemcarrito-subtotal">Subtotal: ${(price * quantity).toLocaleString()}</p>
            </div>
            <button onClick={() => removeItem(id)} className="itemcarrito-x" title="Eliminar producto">X</button>
            <Link to="/" className="itemcarrito-volver">Volver a los productos</Link>
        </div>
    )
};