import { Item } from "../Item/Item"
import "./ItemList.css";

export const ItemList = ({products}) => {
    
    if(!Array.isArray(products)) {
        return <p>No hay productos disponibles</p>
    };
    console.log("Estructura del primer producto:", products[0]);
    
    return (
        <div className="itemlist">
            
            {products.map(prod => <Item 
                                    key={prod.id}
                                    id={prod.id}
                                    title={prod.title}
                                    image={prod.image}
                                    description={prod.description}
                                    category={prod.category}
                                    price={prod.price}
                                    stock={prod.stock} />)}
        </div>
    )
};