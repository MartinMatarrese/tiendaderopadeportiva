import { useEffect, useState } from "react";
import { useAuth } from "../Context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import "./UpdateProduct.css";

const backUrl = process.env.REACT_APP_BACK_URL;

export const UpdateProduct = ({ productId, onUpdate, onCancel }) => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [ accessChecked, setAccessChecked ] = useState(false);
    const [ product, setProduct ] = useState({
        image: "",
        title: "",
        description: "",
        category: "",
        price: "",
        stock: "",
        code: ""
    });

    const [ loading, setLoading ] = useState(false);
    const [ message, setMessage ] = useState("");
    const [ fetching, setFetching ] = useState(true)

    useEffect(() => {
        const fetchProduct = async() => {
            if(!productId) return

            try {
                setFetching(true);
                const response = await axios.get(`${backUrl}api/products/${productId}`);
                const productData = response.data;

                setProduct({
                    image: productData.image || "",
                    title: productData.title || "",
                    description: productData.description || "",
                    category: productData.category || "",
                    price: productData.price?.toString() || "",
                    stock: productData.stock?.toString() || "",
                    code: productData.code || ""
                });

            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "No se pudo cargar el producto"
                });

            } finally {
                setFetching(false)
            };
        };

        fetchProduct();

    }, [productId]);

    useEffect(() => {
        if(!isAuthenticated !== undefined && !authLoading) {
            setAccessChecked(true);
        }
    }, [isAuthenticated, authLoading, user, ]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const productData = {
                ...product,
                price: Number(product.price),
                stock: Number(product.stock)
            };

            await axios.put(`${backUrl}products/${productId}`, productData, { withCredentials: true });

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Producto actualizado exitosamente",
                showConfirmButton: false,
                timer: 1500
            });

            setMessage(" ✅ Producto actualizado correctamente");

            if(onUpdate) {
                onUpdate();
            };

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Error al actualizar el producto";
            Swal.fire({
                position: "center",
                icon: "error",
                text: errorMessage,
                confirmButtonText: "Aceptar"
            });

            setMessage(`❌ ${errorMessage}`)
        } finally {
            setLoading(false);
        };
    };

    const handelChange = (e) => {
        const { name, value } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if(authLoading || !accessChecked) {
        return (
            <div className="admin-panel">
                <div className="loading">Verificando acceso...</div>
            </div>
        );
    };

    if(!isAuthenticated || user?.role !== "admin") {
        return (
            <div className="admin-panel">
                <div className="access-denied">
                    <h2>🔒 Acceso denegado</h2>
                    <p>No tienes permisos para acceder a esta página</p>
                </div>
            </div>
        );
    };

    if(fetching) {
        return (
            <div className="update-product-panel">
                <div className="loading">Cargando producto...</div>
            </div>
        );
    };

    return (
        <div className="update-product-panel">
            <div className="admin-header">
                <h2>Actualizar producto</h2>
                <p>Modifica la información del producto</p>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-grid">
                    <div className="form-group">
                        <label>URL de la imagen *</label>
                        <input 
                            type= "url"
                            name="image"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            value={product.image}
                            onChange={handelChange}
                            required
                        />
                    </div>

                    <div className="from-group">
                        <label>Título del producto *</label>
                        <input 
                            type="text" 
                            name="title"
                            placeholder="Ej: Camiseta titular de la selección Argentina"
                            value={product.title}
                            onChange={handelChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Descripción *</label>
                        <textarea 
                            name="description"
                            placeholder="Descripción del producto"
                            value={product.description}
                            onChange={handelChange}
                            required
                            rows="4"
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label>Categoría *</label>
                        <select 
                            name="category"
                            value={product.category}
                            onChange={handelChange}
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
                            name="price"
                            placeholder="25000"
                            value={product.price}
                            onChange={handelChange}
                            required
                            min="0"
                            step="0.01"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Stock *</label>
                        <input 
                            type="number"
                            name="stock"
                            placeholder="50"
                            value={product.stock}
                            onChange={handelChange}
                            required
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Código Único *</label>
                        <input 
                            type="text"
                            name="code"
                            placeholder="Ca234In"
                            value={product.code}
                            onChange={handelChange}
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
                    {loading ? "⏳ Actualizando..." : "💾 Guardar cambios"}
                </button>
            </form>
        </div>
    );
};