import { useNavigate } from "react-router-dom"
import "./Item.css";
import { useAuth } from "../Context/UserContext";
import Swal from "sweetalert2";

export const Item = ({id, title, image, description, category, price, stock}) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handelVerDetalle = (e) => {
        e.preventDefault();

        if(!isAuthenticated) {
            Swal.fire({
                position: "center", 
                icon: "warning",
                title: "Acceso restringido",
                text: "Debes iniciar session para ver el detalle del producto",
                showCancelButton: true,
                confirmButtonText: "Iniciar sesión",
                cancelButtonText: "Cancelar",
                confirmButtonColor: "#007bff"
            }).then((result) => {
                if(result.isConfirmed) {
                    navigate("/login")
                };
            });
        } else {
            navigate(`/item/${id}`);
        };
    };

    return (
        <div className="item-card">
            <div className="item-content">
                <img className="item-img" src={image} alt={title}/>
                <h2 className="item-header">{title}</h2>
                <p className="item-datos"><strong className="item-datos-datos">Descripción:</strong> {description}</p>
                <p className="item-datos"><strong className="item-datos-datos">Categoria:</strong> {category}</p>
                <p className="item-datos"><strong className="item-datos-datos">Precio:</strong> ${price}</p>
                <p className="item-datos"><strong className="item-datos-datos">Stock:</strong> {stock}</p>
                <button className="item-detalle" onClick={handelVerDetalle}>
                    Ver Detalle
                </button>
            </div>
        </div>
    )
};