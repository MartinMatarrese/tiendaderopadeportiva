import React, { useState } from "react";
import { useAuth } from "../Context/UserContext";
import "./forgotPassword.css";

const ForgotPassword = ({ onBackToLogin, onSuccess }) => {
    const { forgotPassword } = useAuth();
    const [ email, setEmail ] = useState("");
    const [ loading, setLoading ] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await forgotPassword(email);
            if(onSuccess) onSuccess();
        } finally {
           setLoading(false)
        }
    };

    return (
        <main className="forgot-password-main">
            <form className="forgot-password-container" onSubmit={handleSubmit}>
                <h1 className="forgot-password-titulo">Recuperar contraseña</h1>
                <p className="forgot-password-text">
                    Ingresa tu email y te enviaremos las instrucciones para recuperar tu contraseña
                </p>
                <section className="forgot-password-input-box">
                    <input
                        type="email"
                        name="email"
                        placeholder="Ingresa tu email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                    <i></i>
                </section>
                <button className="forgot-password-button" type="submit" disabled={loading}>
                    {loading ? "Enviando..." : "Enviar instrucciones"}
                </button>
                <button type="button" onClick={onBackToLogin} className="back-to-login-btn">
                    ← Volver al login
                </button>
            </form>
        </main>
    );
};

export default ForgotPassword;