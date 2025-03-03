import { useContext, useState } from "react";
import { ItemCount } from "../ItemCount/ItemCount"
import "./ItemDetail.css";
import { CartContext } from "../Context/CartContext";
import { Link } from "react-router-dom";

export const ItemDetail = ({id, title, image, category, price, stock}) => {
    const [cantidadAdd, setCantidadAdd] = useState(0);
    const {addItem} = useContext(CartContext);
    const handleOnAdd = (cantidad) => {
        setCantidadAdd(cantidad)
        const item = {
            title, price, id
        }
        addItem(item, cantidad);
    }
    return (
        <div className="itemdetail">
           <article>
            <picture>
                <img className="itemdetail-img" src={image} alt={title} />
            </picture>
            <header>
                <h2 className="itemdetail-header">{title}</h2>
            </header>
            <section>
                <p className="itemdetail-datos">Categoria: {category}</p>
                <p className="itemdetail-datos">Precio: ${price}</p>
            </section>
            <footer>
                {
                    cantidadAdd > 0 ? (
                        <Link to="/Carrito">Terminar compra</Link>   
                    ) : (
                        <ItemCount iniciar={1} stock={stock} onAdd={handleOnAdd}/>
                    )
                }   
            </footer>
         </article>
        </div>
    )
}