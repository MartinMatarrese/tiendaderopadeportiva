import { useEffect, useState } from "react"
import { ItemDetail } from "../ItemDetail/ItemDetail";
import { useParams } from "react-router-dom";
import { getDoc, doc, getFirestore } from "firebase/firestore";

export const ItemDetailContainer = () => {
    const [productos, setProductos] = useState(null);
    const {itemId} = useParams();
    const {error, setError} = useState(false)

    useEffect(() => {
        const db = getFirestore();
        const docRef = doc(db, "items", itemId)
        getDoc(docRef)
        .then((snapchot) => {
            if(snapchot.exists()){
                setProductos({id: snapchot.id, ...snapchot.data()})
            }
            else(
                setError(false)
            )
        })
    }, [itemId]);
    return (
        <div>
            <ItemDetail {...productos}/>
        </div>
    )
}