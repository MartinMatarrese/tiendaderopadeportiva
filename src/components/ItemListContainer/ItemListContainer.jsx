import { useState, useEffect } from "react"
import { ItemList } from "../ItemList/ItemList";
import { useParams } from "react-router-dom";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import "./ItemListContainer.css";
export const ItemListContainer = () => {
    
    const [productos, setProductos] = useState([]);
    const {categoryId} = useParams();
    const [error, setError] = useState(false);
    
        useEffect(() => {
        const db = getFirestore();
        const itemsCollection = collection(db, "items")
        const q = categoryId ? query(itemsCollection, where("category", "==", categoryId)) : itemsCollection
        getDocs(q)
        .then((snapchot) => {
            setProductos(snapchot.docs.map((doc) => ({id: doc.id, ...doc.data()})));
        })
        .catch(
            setError(true)
        )
    }, [categoryId]);
    return (
        <div className={`container ${categoryId ? `category-${categoryId}` : ''}`}>
            <h2 className="titulo">Nuestros Productos</h2>
            <ItemList productos={productos}/>
        </div>
    )
}