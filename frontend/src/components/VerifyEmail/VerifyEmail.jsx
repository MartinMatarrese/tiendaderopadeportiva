import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const backUrl = process.env.REACT_APP_BACK_URL;

export const VerifyEmail = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [ loading, setLoading ] = useState(true);
    const [ message, setMessage ] = useState("");

    useEffect(() => {
        const verifyEmail = async() => {
            try {
                console.log("Verificando email con token: ", token);
                
                const response = await axios.get(`${backUrl}/users/verify-email/${token}`, { withCredentials: true });
                console.log("Respuesta del backend: ", response.data);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Email Verificado",
                    text: "¡Tu cuenta ha sido verificada exitosamente!",
                    showConfirmButton: true,
                    confirmButtonText: "Iniciar Sessión"
                }).then(() => {
                    navigate("/login");
                });
                
            } catch (error) {
                console.error("Error verificando email:", error.response?.data);
                const errorMsg = error.response?.data?.error || "Error al verificar email"
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: "Error",
                    text: errorMsg,
                    confirmButtonText: "Aceptar"
                }).then(() => {
                    navigate("/");
                });
            } finally {
                setLoading(false)
            };
        };

        if(token) {
            verifyEmail();
        };
    }, [token, navigate]);

    if(loading) {
        return (
            <div style={{textAlign: "center", padding: "50px"}}>
                <h2>Verificando Email...</h2>
                <p>Por favor espere un momento.</p>
            </div>
        );
    };

    return (
        <div style={{textAlign: "center", padding: "50px"}}>
            <h2>Email verificado</h2>
            {message && <p>{message}</p>}
        </div>
    );
};