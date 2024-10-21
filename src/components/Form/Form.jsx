import React, { useContext } from "react";
import Swal from "sweetalert2";
import "./Form.css";
import { CartContext } from "../Context/CartContext";
import db from "../Carrito/Carrito";
import { doc, updateDoc } from "firebase/firestore";

const Form = ({handleChange, submit, formData, error}) =>{
    const {cart, clearCart} = useContext(CartContext);

        const handleSubmit = (e) => {
        e.preventDefault(); 
        submit(e);
        try {
            const batch = db ();
            cart.forEach(async(item) => {
                const producRef = doc(db, 'items', item.id);
                await updateDoc(producRef, {
                    stock: item.stock - item.cantidad
                });
            });
            Swal.fire({
                title: 'Orden Creada',
                text: 'Tu orden ha sido creada exitosamente!',
                icon: 'success',
                confirmButtonText: 'Aceptar'
            })
            .then((result) => {
                if(result.isConfirmed) {
                    clearCart();
                }
            })            
        }
        catch (error) {
            console.log("Error al actualizar el stock", error);
        } 
    }
    return(
        <form onSubmit={handleSubmit} className="form">
            {
                Object.keys(formData).map((key, i) => (
                    <div className="form-datos">
                        <label htmlFor={key} key={i}>Ingrese su {key}:</label>
                        <input type="text" name={key} id={key} onChange={handleChange} required className="input"/>
                        {
                            error[key] && <span>{error[key]}</span>
                        }
                    </div>
                ))
            }
                <button type={submit} className="form-orden">crear orden</button>
            </form>
    )
}
export default Form;