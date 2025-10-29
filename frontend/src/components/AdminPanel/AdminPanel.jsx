import { useState, useEffect } from "react"
import { useAuth } from "../Context/UserContext";
import axios from "axios";
import { UpdateProduct } from "./UpdateProduct";
import { DeleteProduct } from "./DeleteProduct";
import { ItemList } from "../ItemList/ItemList";
import Swal from "sweetalert2";
import "./AdminPanel.css"

const backUrl = process.env.REACT_APP_BACK_URL

export const AdminPanel = () => {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [ currentView, setCurrentView ] = useState("list");
    const [ selectProduct, setSelectProduct ] = useState(null);
    const [ products, setProducts ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const fetchProducts = async() => {
            try {
                setLoading(true);
                const response = await axios.get(`${backUrl}api/products`);
                setProducts(response.data);
            } catch (error) {
                const errorMessage = error.response?.data?.message || "Error al cargar los productos"
                Swal.fire({
                    position: "center", 
                    icon: "error", 
                    title: "Error",
                    text: errorMessage,
                    showConfirmButton: true, 
                    confirmButtonText: "Aceptar" 
                });
            } finally {
                setLoading(false);
            };
        };

        if(currentView === "list") {
            fetchProducts();
        };
    }, [currentView]);

    const handleEditProduct = (product) => {
        setSelectProduct(product);
        setCurrentView("update");
    };

    const handleDeleteProduct = (product) => {
        setSelectProduct(product);
        setCurrentView("delete");
    };

    const handleBackToList = () => {
        setCurrentView("list");
        setSelectProduct(null);
    };

    const handleProductUpdate = () => {
        handleBackToList();
    };

    const handleProductDelete = () => {
        handleBackToList();
    };

    if(authLoading) {
        return <div className="admin-loading">Verificando acceso...</div>
    }

    if(!isAuthenticated || user?.role !== "admin") {
        return (
            <div className="access-denied">
                <h2>Acceso denegado</h2>
                <p>No tienes permisos de administrador</p>
            </div>
        )
    }

    return (
        <div className="product-management">
            {currentView === "list" && (
                <div className="admin-list-view">
                    <div className="admin-panel-header">
                        <h1>🛠️ Panel de Administración</h1>
                        <p>Gestión completa de productos</p>
                    </div>
                    <div className="admin-list-header">
                        <h2>📦 Lista de Productos</h2>
                        <div className="admin-stats">
                            <div className="stat-card">
                                <span className="stat-number">{products.length}</span>
                                <span className="stat-label">Productos</span>
                            </div>
                            <div className="stat-card">
                                <span className="stat-number">
                                    {products.filter(p => p.stock < 10).length}
                                </span>
                                <span className="stat-label">Stock Bajo</span>
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <div className="admin-loading">Cargando productos...</div>
                    ): (
                        <ItemList
                            products={products}
                            onEditProduct={handleEditProduct}
                            onDeleteProduct={handleDeleteProduct}
                            isAdminView={true}
                        />
                    )}
                </div>
            )}

            {currentView === "update" && selectProduct && (
                <UpdateProduct
                    productId={selectProduct.id}
                    onUpdate={handleProductUpdate}
                    onCancel={handleBackToList}
                />
            )}

            {currentView === "delete" && selectProduct && (
                <DeleteProduct
                    productId={selectProduct.id}
                    productTitle={selectProduct.title}
                    onDelete={handleProductDelete}
                    onCancel={handleBackToList}
                />
            )}
        </div>
    );
};