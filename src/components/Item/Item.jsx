import { Link } from "react-router-dom"
import "./Item.css";

export const Item = ({id, title, image, Descripción, price, stock}) => {
    return (
        <div className="item-card">
            <div className="item-content">
                <img className="item-img" src={image} alt={title}/>
                <h2 className="item-header">{title}</h2>
                <p className="item-datos">{Descripción}</p>
                <p className="item-datos">Precio: ${price}</p>
                <p className="item-datos">Stock: {stock}</p>
                <Link to={`/item/${id}`} className="item-detalle">Ver Detalle</Link>
            </div>
        </div>
    )
}