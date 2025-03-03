import React from "react";
import { Link } from "react-router-dom";
import "./login.css";

const Login = () => {
    return <main className="login-main">
                <form className="login-container">
                <h1 className="login-titulo">Ingresar</h1>

                <section className="input-box">
                    <input type="text" name="mail" placeholder="Mail"/>
                    <i className="bx bxs-user"></i>
                </section>
                <section className="input-box">
                    <input type="password" name="password" placeholder="Password"/>
                    <i className="bx bx-lock-alt"></i>
                </section>
                <section className="remember-forgot-box">
                    <div className="remember-me">
                        <input type="checkbox" name="remember-me" id="remember-me"/>
                        <label htmlFor="remember-me">
                            <h5>Rcuerdame</h5>
                        </label>
                    </div>
                    <Link className="forget-password" to="/reset-password">
                    <h5>¿Te olvidaste la contraseña?</h5>
                </Link>
                </section>

                <button className="login-button" type="submit">Login</button>

                <h5 className="dont-have-an-account">¿No tienes una cuenta? <Link to="/register" className="login"><b>Registrate</b></Link></h5>
            </form>
           </main>
}

export default Login;