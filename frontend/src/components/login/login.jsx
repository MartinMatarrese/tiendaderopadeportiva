import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./login.css";
import { useAuth } from "../Context/UserContext";
import GoogleLoginButton from "./googleLoginButton";
import ForgotPassword from "./forgotPassword";

export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathame || "/";
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showForgotPassword, setShowForgotPassword] = useState(false)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        login(formData, navigate);

        await login(credentials, () => {
            navigate(from, { replace: true })
        })
    };

    if(showForgotPassword) {
        return (
            <main className="login-main">
                <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)}/>
            </main>
        )
    }
    return  <main className="login-main">
                <form className="login-container" onSubmit={handleSubmit}>
                    <h1 className="login-titulo">Ingresar</h1>
                    <section className="btn-google">
                        <GoogleLoginButton/>
                    </section>
                    <div>
                        <p>----------Or----------</p>
                    </div>
                    <section className="input-box">
                        <input type="text" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required/>
                        <i className="bx bxs-user"></i>
                    </section>
                    <section className="input-box">
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
                        <i className="bx bx-lock-alt"></i>
                    </section>
                    <section className="remember-forgot-box">
                        <div className="remember-me">
                            <input type="checkbox" name="remember-me" id="remember-me"/>
                            <label htmlFor="remember-me">
                                <h5>Rcuerdame</h5>
                            </label>
                        </div>
                        <button type="button" className="forget-password-btn" onClick={() => setShowForgotPassword(true)}>
                            <h5>¿Te olvidaste la contraseña?</h5>
                        </button>
                    </section>
                    <button className="login-button" type="submit">Login</button>
                    <h5 className="dont-have-an-account">¿No tienes una cuenta? <Link to="/register" className="login"><b>Registrate</b></Link></h5>
                </form>
           </main>
};