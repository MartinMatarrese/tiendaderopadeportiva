import { useContext, useState } from "react"
import { CartContext } from "../Context/CartContext"
import { Link } from "react-router-dom"
import { ItemCarrito } from "../ItemCarrito/ItemCarrito"
import Form from "../Form/Form"
import { collection, addDoc } from "firebase/firestore"
import db  from "../../index";
import "./Carrito.css";

const Carrito = () => {
    const [buyer, setBuyer] = useState({
        Nombre:"",
        Apellido:"",
        Direccion:"",
        Email:"",
    })
    const[error, setError] = useState({
        Nombre:"",
        Apellido:"",
        Direccion:"",
        Email:"",
    })
    const {cart, clearCart, cantidadTotal, total} = useContext(CartContext);
    const handleChange = (e) =>{
        setBuyer({
            ...buyer,
            [e.target.name] : e.target.value
        })
    }
    const submit = (e) => {
        e.preventDefault();
        const localError = {}
        if(!buyer.Nombre){
            localError.Nombre="El nombre es obligatorio"
        }
        if(!buyer.Apellido){
            localError.Apellido="El apellido es obligatorio"
        }
        if(!buyer.Direccion){
            localError.Direccion="La direccion es obligatoria"
        }
        if(!buyer.Email){
            localError.Email="El email es obligatorio"
        }
        if(Object.keys(localError).length === 0){
            addtoCart()
        }
        else{
            setError(localError)
        }
    }

    const addtoCart = () => {
        const orderCollection = collection(db, "orders")
        const purchase = {
            buyer,
            item: cart,
            total,
            date: new Date()
        }
        addDoc(orderCollection, purchase)
        .then(res => {
            clearCart();
        })
        .catch(err => setError("Error al crear la orden"))
    };

    if(cantidadTotal === 0) {
        return (
            <div>
                <h2 className="vacio">No hay productos agregados al carrito</h2>
                <Link to="/" className="vacio-volver">Volver a los Productos</Link>
            </div>
        )
    }
    return (
            <div className="carrito">
                {cart.map(p => <ItemCarrito key={p.id} {...p}/>)}
                <h3 className="carrito-total">Total: ${total}</h3>
                <button onClick={() => clearCart()} className="carrito-limpiar">Limpiar carrito</button>
                <Form 
                handleChange={handleChange}
                submit={submit}
                formData={buyer}
                error={error}
                />
            </div>    
    )
}
export default Carrito;