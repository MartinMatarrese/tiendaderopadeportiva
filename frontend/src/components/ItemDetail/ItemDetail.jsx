import { useState } from "react";
import { ItemCount } from "../ItemCount/ItemCount"
import "./ItemDetail.css";
import { useCart } from "../Context/CartContext";
import { useNavigate } from "react-router-dom";

export const ItemDetail = ({id, title, image, category, price, stock}) => {
    const [ cantidadAdd, setCantidadAdd ] = useState(0);
    const { addItem, cart } = useCart();
    const naivigate = useNavigate();
    
    const handleOnAdd = (cantidad) => {
        console.log("handleOnAdd ejecutado, cantidad:", cantidad);
        
        setCantidadAdd(cantidad)
        const item = {
            id: id, title, price, image
        }
        console.log("Item a agregar:", item);
        
        addItem(item, cantidad);
        setTimeout(() => {
            console.log("Carrito actual:", cart);            
        })
    };

    const handleTerminarCompra = () => {
        naivigate("/Carrito")
    };

    return (
        <div className={`itemdetail ${stock === 0 ? "out-of-stock" : ""} ${stock < 10 ? "low-stock" : ""}`} data-stock={stock}>
            <article>
                <picture>
                    <img className="itemdetail-img" src={image} alt={title} />
                </picture>
                <header>
                    <h2 className="itemdetail-header">{title}</h2>
                </header>
                <section>
                    <p className="itemdetail-datos">Categoria: {category}</p>
                    <p className="itemdetail-datos">Precio: ${price.toLocaleString()}</p>
                </section>
                <footer>
                    {
                        cantidadAdd > 0 ? (
                            <div className="button-container">
                                <button onClick={handleTerminarCompra} className="item-detail-btn-terminar-compra">Terminar compra</button>
                                <button onClick={() => setCantidadAdd(0)} className="item-detail-btn-seguir-comprando">Seguir comprando</button>
                            </div>  
                        ) : (
                            <ItemCount iniciar={1} stock={stock} onAdd={handleOnAdd}/>
                        )
                    }   
                </footer>
            </article>
        </div>
    );
};