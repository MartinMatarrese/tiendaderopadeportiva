import { useState, useEffect } from "react"
import { ItemList } from "../ItemList/ItemList";
import { useParams, useSearchParams } from "react-router-dom";
import "./ItemListContainer.css";
import axios from "axios";
import { useAuth } from "../Context/UserContext";

export const ItemListContainer = () => {
    const [ products, setProducts ] = useState([]);
    const { categoryId } = useParams();
    const [error, setError] = useState(false);
    const [ searchParams, setSearchParams ] = useSearchParams();
    const { setUser } = useAuth();

    useEffect(() => {
        const token = searchParams.get("token");
        if(token) {
            sessionStorage.setItem("token", token);
            const fetchCurrentUser = async() => {
                try {
                    const res = await axios.get("http://localhost:8080/users/current", {
                    headers: {Authorization: `Bearer ${token}`}
                    });
                    setUser(res.data.user);
                } catch (error) {
                    console.error("Error al obtener el usuario:", error);                        
                };
            };
            fetchCurrentUser({});
        }
    }, [searchParams, setUser]);
    
    useEffect(() => {
        const url = categoryId ? `http://localhost:8080/api/products?category=${categoryId}` : `http://localhost:8080/api/products`;
        axios.get(url)
            .then(response => {
                console.log(response.data);
                if(response.data && Array.isArray(response.data)) {
                    setProducts(response.data)
                }
            })
            .catch(() => {
                setError(true);
            })
    }, [categoryId]);

    const categoryNames = {
        "camisetas": "Camisetas",
        "camperas": "Camperas",
        "shorts": "Shorts",
        "botines": "Botines" 
    }

    const categoryTitle = categoryId ? categoryNames[categoryId] || "Categoria desconocida" : "Nuestros productos";
    return (
        <div className={`container ${categoryId ? `category-${categoryId}` : ''}`}>
            <h2 className="titulo">{categoryTitle}</h2>
            {error ? <p>Error al cargar los productos.</p> : <ItemList products={products}/>}
        </div>
    )
};