import React, { useContext } from "react";
import Swal from "sweetalert2";
import "./Form.css";
import { CartContext } from "../Context/CartContext";

const Form = ({handleChage, submit, formData, error}) =>{
    const {clearCart} = useContext(CartContext);

        const handleSubmit = (e) => {
        e.preventDefault(); 
        submit(e);
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
    return(
        <form onSubmit={handleSubmit} className="form">
            {
                Object.keys(formData).map((key, i) => (
                    <div className="form-datos">
                        <label htmlFor={key} key={i}>Ingrese su {key}</label>
                        <input type="text" name={key} id={key} onChange={handleChage} required/>
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