import { useState } from "react";
import { useAuth } from "../Context/UserContext";
import Swal from "sweetalert2";
import axios from "axios";
import "./DeleteProduct.css"

const backUrl = process.env.REACT_APP_BACK_URL;
export const DeleteProduct = ({productId, productTitle, onDelete, onCancel}) => {
    const { user, isAuthenticated } = useAuth();
    const [ loading, setLoading ] = useState(false);

    const handleDelete = async() => {
        const result = await Swal.fire({
            position: "center",
            title: "¿Estas seguro?",
            html: `
                <div style="text-align: center;">
                    <p>¡No podrás revertir esta acción!</p>
                    <p><strong>"${productTitle}"</strong>será eliminado permanentemente.</p>
                </div>
            `,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        });

        if(result.isConfirmed) {
            try {
                setLoading(true);

                await axios.delete(`${backUrl}/api/products/${productId}`, { withCredentials: true });

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Eliminado",
                    text: `${productTitle} ha sido eliminado correctamente`,
                    timer: 2000,
                    showCancelButton: false
                });

                if(onDelete) {
                    onDelete();
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || "No se pudo eliminar el producto";

                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error",
                    text: errorMessage,
                    confirmButtonText: "Aceptar"
                });
            } finally {
                setLoading(false);
            };
        };
    };

    if(!isAuthenticated || user?.role !== "admin") {
        return (
            <div className="access-denied">
                <h2>🔒 Acceso denegado</h2>
                <p>No tienes permisos para realizar esta accioón</p>
            </div>
        );
    };

    return (
        <div className="delete-product-panel">
            <div className="delete-header">
                <h2>🗑️ Eliminar producto</h2>
                <p>Estas a punto de eliminar un producto</p>
            </div>

            <div className="product-info">
                <h3>{productTitle}</h3>
                <p>ID: {productId}</p>
            </div>

            <div className="warning-message">
                <div className="warninrg-icon">⚠️</div>
                <div className="warning-text">
                    <h4>Advertencia</h4>
                    <p>Esta acción no se puede deshacer. El producto sera eliminado permanentemente de la base de datos</p>
                </div>
            </div>

            <div className="delete-actions">
                <button 
                    type="button"
                    className="cancel-btn"
                    onClick={onCancel}
                    disabled={loading}
                >
                    ↩️ Cancelar
                </button>

                <button
                    type="button"
                    className="delete-confirm-btn"
                    onClick={handleDelete}
                    disabled={loading}
                >
                    {loading ? "⏳ Eliminando..." : "🗑️ Eliminar permanentemente"}
                </button>
            </div>
        </div>
    );
};