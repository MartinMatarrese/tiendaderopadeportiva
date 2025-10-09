import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/UserContext"
import { useEffect } from "react";
import Swal from "sweetalert2";

export const ProtectedRoute = ({children}) => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();            

    useEffect(() => {
        if(!loading && !isAuthenticated && location.pathname.startsWith("/item/")) {
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
                    window.location.href = "/login";
                } else {
                    window.location.href = "/tiendaderopadeportiva";
                };
            });
        };
    }, [isAuthenticated, loading, location]);

    if(loading) {
        return <div>Cargando...</div>
    };

    if(!isAuthenticated) {
        return <Navigate to={"/login"} state={{from: location}} replace/>
    };

    return children;
}