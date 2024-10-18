import { Link } from "react-router-dom"
import "./Item.css";

export const Item = ({id, title, image, Descripción, price, stock}) => {
    const ItemClass = `item-${id}`;
    return (
            <div className={`item ${ItemClass}`}>
            <article>
            <picture>
                <img className="item-img" src={image} alt={title}/>
            </picture>
            <header>
                <h2 className="item-header">{title}</h2>
            </header>
            <section>
                <p className="item-datos" id="descripcion">{Descripción}</p>
                <p className="item-datos">Precio: ${price}</p>
                <p className="item-datos">Stock: {stock}</p>
            </section>
            <footer>
                <Link to={`/item/${id}`}><h3 className="item-detalle">Ver Detalle</h3></Link>
            </footer>
        </article>
        </div>
    )
}