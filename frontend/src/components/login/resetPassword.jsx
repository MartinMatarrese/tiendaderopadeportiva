import React, { useEffect, useState } from "react";
import {useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/UserContext";
import "./resetPassword.css";
import Swal from "sweetalert2";

const ResetPassword = () => {
    console.log("ResetPassword component RENDERED");
    
    const { resetPassword } = useAuth();
    const [ searchParams ] = useSearchParams();
    const navigate = useNavigate();
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ loading, setLoading ] = useState(false);
    const [ token, setToken ] = useState("");
    const [ message, setMessage ] = useState("");
    const [ error, setError ] = useState("")

    useEffect(() => {
        const tokenFromUrl = searchParams.get("token");
        if(!tokenFromUrl) {
            console.log("No token found in URL");
            
            Swal.fire({
                position: "center", 
                icon: "error", 
                title: "Error", 
                text: "Token inválido o faltante", 
                confirmButtonText: "Aceptar" 
            }); 
        } else {
            console.log("Token found: ", tokenFromUrl);            
        }
        setToken(tokenFromUrl);
    }, [searchParams]);

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(password !== confirmPassword) {
            Swal.fire({
                position: "center", 
                icon: "error", 
                title: "Error", 
                text: "Las contraseñas no coinciden", 
                confirmButtonText: "Aceptar" 
            }); 
            return;
        }
        if(password.length < 6 ) {
            Swal.fire({
                position: "center", 
                icon: "error", 
                title: "Error", 
                text: "La contraseña debe tener al menos 6 caracteres", 
                confirmButtonText: "Aceptar" 
            }); 
            return;
        }
        setLoading(true);

        try {
            await resetPassword(token, password);
            setTimeout(() => navigate("/login"), 3000);
        } finally {
            setLoading(false);
        }
    };

    if(!token) {
        return (
            <div className="reset-password-container">
                <div className="error-message">
                    {message || "Token inválido o faltante"}
                </div>
                <button onClick={() => navigate("/login")}>
                    Volver al login
                </button>
            </div>
        );
    };

    return (
        <main className="reset-password-main">
            <form className="reset-password-container" onSubmit={handleSubmit}>
                <h1 className="reset-password-titulo">Nueva contraseña</h1>
                <p className="reset-password-text">
                    Ingresa tu nueva contraseña
                </p>
                {error && <div className="reset-password-error">{error}</div>}
                <section className="reset-password-input-box">
                    <label>Nueva contraseña</label>
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                    placeholder="Mínimo 6 caracteres"
                    />
                    <i className="bx bx-lock-alt"></i>
                </section>
                <section className="reset-password-input-box">
                    <label>Repetir contraseña</label>
                    <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Repite tu contraseña"
                    />
                    <i className="bx bx-lock-alt"></i>
                </section>
                <button className="reset-pasword-button" type="submit" disabled={loading}>
                    {loading ? "Actualizando..." : "Actualizar contraseña"}
                </button>
                <button className="reset-pasword-button" type="button" onClick={() => navigate("/login")}>
                    ← Volver al login
                </button>
            </form>        
        </main>
    );
};

export default ResetPassword;