import { useNavigate } from "react-router-dom";
import "./register.css";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useAuth } from "../Context/UserContext";

export const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        age: "",
        password: ""
    });
    const [error, setError] = useState(false);
    const [ showPassword, setShowPasswword ] = useState(false);
    const [ passwordStrength, setPasswordStrength ] = useState({
        score: 0,
        feedback: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    useEffect(() => {
        const evalutePasswordStrength = (password) => {
            let score = 0;
            let feedback = [];

            if(password.length >= 6) { 
                score += 1;
            } else {
                feedback.push("Minimo 6 carácteres");
            };

            if(password.length >= 8) {
                score += 1;
            } else if(/[A-Z]/.test(password)) {
                score += 1
            } else {
                feedback.push("Incluir mayúsculas")
            };

            if(/[0-9]/.test(password)) {
                score += 1
            } else {
                feedback.push("Incluir números")
            };

            if(/[^A-Za-z0-9]/.test(password)) {
                score += 1
            } else {
                feedback.push("Incluir símbolos")
            };

            return {
                score,
                feedback: feedback.length > 0 ? feedback.join(", ") : "Contaseña segura"
            };
        };

        setPasswordStrength(evalutePasswordStrength(formData.password))
    }, [formData.password]);

    const getStrengthColor = () => {
        if(formData.password.length === 0) return "transparent";
        if(passwordStrength.score <= 1) return "#ff4444";
        if(passwordStrength.score <= 3) return "#ffaa00";
        return "#00c851";
    };

    const getStrengthText = () => {
        if(formData.password.length === 0) return "";
        if(passwordStrength.score <= 1) return "Débil";
        if(passwordStrength.score <= 3) return "Media";
        return "Fuerte";
    }
    const handleSubmit = async(e) => {
        e.preventDefault();

        if(formData.password.length < 6) {
            Swal.fire({
                icon: "error",
                title: "Contraseña muy corta",
                text: "La contraseña debe tener al menos 6 caracteres"
            });
            return;
        };

        try {
            await register(formData);
            setTimeout(() => {
                    navigate("/login")
                }, 1600);

        } catch(error) {
            const errorMsg = error.response?.data?.message || "Hubo un error al registrar el usuario";
            setError(errorMsg);
            Swal.fire({
                icon: "error",
                title: "Oops..",
                text: errorMsg
            });
        };
    };

    const togglePasswordVisibility = () => {
        setPasswordStrength(!showPassword);
    }

    return <main className="register-main">
               <form className="register-container" onSubmit={handleSubmit}>
                   <h1 className="register-titulo">Registrarse</h1> 
                    <section className="register-box">
                        <input 
                            type="text"
                            name="first_name" 
                            placeholder="Nombre"
                            value={formData.first_name} 
                            onChange={handleChange} 
                            required
                        />
                        <i className="register-icon">👤</i>
                    </section>

                    <section className="register-box">
                        <input
                            type="text" 
                            name="last_name" 
                            placeholder="Apellido" 
                            value={formData.last_name} 
                            onChange={handleChange} 
                            required
                        />
                        <i className="register-icon">👥</i>
                    </section>

                    <section className="register-box">
                        <input 
                            type="text"
                            name="email" 
                            placeholder="Mail" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required
                        />
                        <i className="register-icon">📧</i>
                    </section>

                    <section className="register-box">
                        <input 
                            type="number" 
                            name="age" 
                            placeholder="Edad" 
                            value={formData.age} 
                            onChange={handleChange} 
                            required
                        />
                        <i className="register-icon">🎂</i>
                    </section>

                    <section className="register-box password-container">
                        <input 
                            type={showPassword ? "text" : "password"}
                            name="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            required
                        />
                        <i className="register-icon">🔒</i>
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={togglePasswordVisibility}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>
                    </section>

                    {formData.password && (
                        <div className="password-strength">
                            <div className="strength-bar-container">
                                <div 
                                    className="strenght-bar"
                                    style={{
                                        width: `${(passwordStrength.score / 5) * 100}%`,
                                        backgroundColor: getStrengthColor()
                                    }}
                                ></div>
                            </div>
                            <div className="strenght-info">
                                <span className="strength-text">{getStrengthText()}</span>
                                <span className="strength-feedback">{passwordStrength.feedback}</span>
                            </div>
                        </div>
                    )}
                        <button type="submit" className="register-button">
                            <p>Crear cuenta</p>
                        </button>

                        {error && <p className="error-message">Hubo un error al registrar el usuario.</p>}

                        <div className="login-redirect">
                            <p>¿Ya tienes cuenta? <span onClick={() => navigate("/login")}>Iniciar sesión</span></p>
                        </div>
               </form> 
          </main>
};