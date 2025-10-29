import { useEffect, useState } from "react"
import { ItemDetail } from "../ItemDetail/ItemDetail";
import { useParams } from "react-router-dom";
import axios from "axios";

const backUrl = process.env.REACT_APP_BACK_URL;

export const ItemDetailContainer = () => {
    const [product, setProduct] = useState(null);
    const { itemId } = useParams();
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("token");
        const url = `${backUrl}api/products/${itemId}`;
        axios.get(url, {
            headers: token ? { Authorization: `Bearer ${token}`} : {}
            }
        )
        .then(response => {
            setProduct(response.data)
        })
        .catch(() => {
            setError(true);
        })
        .finally(() => {
            setLoading(false)
        });
    
    }, [itemId]);

    if(loading) return <div>Carrgando producto...</div>

    if(error) return <div><p>Error al cargar el producto</p></div>

    if(!product) return <p>Producto no encontrado</p>

    return (
        <div>
            <ItemDetail
                id={product.id}
                title={product.title}
                image={product.image}
                category={product.category}
                price={product.price}
                stock={product.stock}
            />
        </div>
    )
};