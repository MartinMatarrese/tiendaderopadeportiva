import { useState } from "react"
import { Link } from "react-router-dom";
import "./ItemCount.css";
import Swal from "sweetalert2";
export  const ItemCount = ({stock, iniciar, onAdd}) => {
    const [cantidad, setCantidad] = useState(iniciar);
    const incrementar = () =>{
        if(cantidad < stock) {
            setCantidad(cantidad + 1);
        }
    }
    const decrementar = () => {
        if(cantidad > 1) {
            setCantidad(cantidad - 1);
        }
    }
    const handleAdd = () => {
        onAdd(cantidad);
        Swal.fire({
            position: "top-center",
            icon: "success",
            title: "Producto agregado al carrito",
            showConfirmButton: false,
            timer: 1500
          });
    }
    return (
        <div>
            <div className="contador">
                <button onClick={incrementar} className="contador-boton">Agregar</button>
                <p className="contador-cantidad">{cantidad}</p>
                <button onClick={decrementar} className="contador-boton">Quitar</button>
            </div>
            <div>
                <button onClick={handleAdd} disabled={cantidad > stock || stock <= 0} className="contador-agregar">Agregar al carrito</button>
            </div>
            <div>
                <Link to="/" className="contador-volver">Volver a los Productos</Link>
            </div>
        </div>
    )
}