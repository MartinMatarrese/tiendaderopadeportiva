import React, { useContext } from "react";
import Swal from "sweetalert2";
import "./Form.css";
import { CartContext } from "../Context/CartContext";
import db from "../../index";
import { doc, updateDoc } from "firebase/firestore";

const Form = ({handleChange, submit, formData, error}) =>{
    const {cart, clearCart} = useContext(CartContext);

        const handleSubmit = (e) => {
        e.preventDefault(); 
        submit(e);
        try {
            cart.forEach(async(item) => {
                const producRef = doc(db, 'items', item.id);
                const stockActual = Number(item.stock);
                const cantidadComprada = Number(item.cantidad);
                if(!isNaN(stockActual) && !isNaN(cantidadComprada)){
                    await updateDoc(producRef, {
                        stock: item.stock - item.cantidad
                    });
                }
                else {
                    console.error(`Stock o cantidad inválidos para el producto title: ${item.title}`);
                }
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
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al crear tu orden. ' + error.message,
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } 
    }
    return(
        <form onSubmit={handleSubmit} className="form">
            {
                Object.keys(formData).map((key, i) => (
                    <div className="form-datos">
                        <label htmlFor={key} key={i}>Ingrese su {key}:</label>
                        <input type="text" name={key} id={key} value={formData[key]} onChange={handleChange} required className="input"/>
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