import { useNavigate } from "react-router-dom"
import "./Item.css";
import { useAuth } from "../Context/UserContext";
import Swal from "sweetalert2";

export const Item = ({id, title, image, description, category, price, stock, code, isAdminView = false, onEdit, onDelete}) => {
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
        <div className={`item-card ${isAdminView ? "admin-card" : ""} ${stock === 0 ? "out-of-stock" : ""} ${stock < 10 ? "low-stock" : ""}`} data-stock={stock}>
            <div className="item-content">
                <img src={image} alt={title} className="item-img"/>
                {isAdminView && (
                    <div className="admin-overlay">
                        <div className="admin-actions">
                            <button
                                className="edit-btn"
                                onClick={onEdit}
                                title="Editar producto"
                            >
                                ✏️
                            </button>
                            <button
                                className="delete-btn"
                                onClick={onDelete}
                                title="Eliminar Producto"
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                )}
                <div className="item-info">
                    <h3 className="item-title">{title}</h3>
                    <p className="item-description">{description}</p>
                    <div className="item-details">
                        <span className="item-price">${price}</span>
                        <span className="item-stock">Stock: {stock}</span>
                        <span className="item-category">{category}</span>
                    </div>
                    {isAdminView && (
                        <div className="admin-product-details">
                            <div className="detail-item">
                                <span className="detail-label">ID:</span>
                                <span className="detail-value">{id}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Código</span>
                                <span className="detail-value">{code || "N/A"}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Categoría</span>
                                <span className="detail-value">{category}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Estado:</span>
                                <span className="detail-value">
                                    {stock === "0" ? "❌ Sin Stock" : stock < 10 ? "⚠️ Stock Bajo" : "✅ En Stock"}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                {!isAdminView && (
                    <button className="item-detalle" onClick={handelVerDetalle}>
                        Ver Detalle
                    </button>
                )}
            </div>
        </div>
    )
};