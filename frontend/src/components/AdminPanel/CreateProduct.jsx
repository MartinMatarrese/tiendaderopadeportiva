import { useEffect, useState } from "react";
import { useAuth } from "../Context/UserContext"
import axios from "axios";
import Swal from "sweetalert2";
import "./CreateProduct.css";

const backUrl = process.env.REACT_APP_BACK_URL;

export const CreateProduct = () => {
    const { user, isAuthenticated } = useAuth();
    const [accessChecked, setAccessChecked] = useState(false)

    const [product, setProduct] = useState({
        image: "",
        title: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        code: "",
    });

    const [ loading, setLoading ] = useState(false);

    const [ message, setMessage ] = useState("");

    useEffect(() => {
        if(isAuthenticated !== undefined) {
            setAccessChecked(true)
        }
    }, [isAuthenticated, user])

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            await axios.post(`${backUrl}/api/products`, {...product, price: (product.price), stock: (product.stock)}, {withCredentials: true});
           Swal.fire({
                position: "center", 
                icon: "success", 
                title: "Producto creado exitosamente",
                showConfirmButton: true, 
                confirmButtonText: "Aceptar" 
            });
            setProduct({
                image: "", title: "", description: "", category: "", price: "", stock: "", code: ""
            })
        } catch (error) {
            Swal.fire({
                position: "center", 
                icon: "error", 
                title: "Error al crear el producto",
                text: error.response?.data?.message || error.message,
                showConfirmButton: true, 
                confirmButtonText: "Aceptar" 
            });
        } finally {
            setLoading(false)
        };
    };

    if(!accessChecked) {
        return (
            <div className="admin-panel">
                <div className="loading">Cargando...</div>
            </div>
        );
    };

    if(!isAuthenticated || user?.role !== "admin") {
        return (
            <div className="admin-panel">
                <div className="access-denied">
                    <h2>🔒 Acceso denegado</h2>
                    <p>No tienes permisos para acceder a esta página</p>
                    <p>Usuario: {user?.email} | Rol: {user.role}</p>
                </div>
            </div>
        );
    };

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h2>🛠️ Panel de Administración</h2>
                <p>Gestión de Productos</p>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>URL de la imagen *</label>
                    <input 
                        type="url" 
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={product.image}
                        onChange={(e) => setProduct({...product, image: e.target.value})}
                        required
                    />
                    </div>
                    <div className="form-group">
                        <label>Titulo del producto *</label>
                        <input 
                            type="text"
                            placeholder="Ej: Camiseta titular de la Selección Argentina"
                            value={product.title}
                            onChange={(e) => setProduct({...product, title: e.target.value})}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Descripción *</label>
                        <textarea 
                            placeholder="Descripción detallade del producto"
                            value={product.description}
                            onChange={(e) => setProduct({...product, description: e.target.value})}
                            required
                            rows="3"
                        ></textarea>
                    </div>
                    <div className="form-group">
                        <label>Categoria *</label>
                        <select 
                            value={product.category}
                            onChange={(e) => setProduct({...product, category: e.target.value})}
                            required
                        >
                            <option value="">Seleccionar Categoría</option>
                            <option value="camisetas">camisetas</option>
                            <option value="camperas">camperas</option>
                            <option value="shorts">shorts</option>
                            <option value="botines">botines</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Precio (ARS) *</label>
                        <input 
                            type="number"
                            placeholder="25000"
                            value={product.price}
                            onChange={(e) => setProduct({...product, price: e.target.value})}
                            required
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label>Stock *</label>
                        <input 
                            type="number" 
                            placeholder="50"
                            value={product.stock}
                            onChange={(e) => setProduct({...product, stock: e.target.value})}
                            required
                            min="0"
                        />
                    </div>
                    <div className="form-group">
                        <label>Código Único *</label>
                        <input 
                            type="string"
                            placeholder="Ca234In"
                            value={product.code}
                            onChange={(e) => setProduct({...product, code: e.target.value})}
                            required
                        />
                    </div>
                </div>
                {message && (
                    <div className={`message ${message.includes("✅") ? "success" : "error"}`}>
                        {message}
                    </div>
                )}
                <button className="submit-btn">
                    {loading ? "⏳ Creando..." : "📦 Crear Producto"}
                </button>
            </form>
        </div>
    )
}