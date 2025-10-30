import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const AuthSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handlteAuthSuccess = async() => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const token = urlParams.get("token");

                if(!token) {
                    Swal.fire("Error", "No se recibio el token de autenticación", "error");
                    navigate("/login");
                    return;
                };

                sessionStorage.setItem("token", token);

                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

                const backUrl = process.env.REACT_APP_BACK_URL;
                const response = await axios.get(`${backUrl}users/current`);

                sessionStorage.setItem("user", JSON.stringify(response.data.user));

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: `¡Bienvenido ${response.data.user.first_name} ${response.data.user.last_name}!`,
                    showConfirmButton: true,
                    timer: 1500
                });

                navigate("/");

            } catch (error) {
                console.error("Error en autenticación", error);
                Swal.fire("Error", "Error al completar la autenticación", "error");
                navigate("/login");
            }
        };

        handlteAuthSuccess();
    }, [navigate]);

    return (
        <div style={{
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            height: "100vh"}}>
                <h2>Procesandto autenticación...</h2>
        </div>
    );
};

export default AuthSuccess;