import { Item } from "../Item/Item"
import "./ItemList.css";

export const ItemList = ({products, onEditProduct, onDeleteProduct, isAdminView = false}) => {
    
    if(!Array.isArray(products)) {
        return <p>No hay productos disponibles</p>
    };
    
    return (
        <div className={`itemlist ${isAdminView ? "admin-view" : ""}`}>
                {products.map(product => (
                    <Item
                        key={product.id}
                        {...product}
                        isAdminView={isAdminView}
                        onEdit={onEditProduct ? () => onEditProduct(product) : "undefined"}
                        onDelete={onDeleteProduct ? () => onDeleteProduct(product) : "undefined"}
                    />
                ))}
        </div>
    )
};