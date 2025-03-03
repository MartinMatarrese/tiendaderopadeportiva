import React from "react";
import { Link } from "react-router-dom";
import "./register.css";

const Register = () => {
    return <main className="register-main">
               <form className="register-container">
                   <h1 className="register-titulo">Registrarse</h1> 
                    <section className="register-box">
                        <input type="text" name="name" placeholder="Nombre"/>
                        <i className="register-nombre"></i>
                    </section>
                    <section className="register-box">
                        <input type="text" name="username" placeholder="Apellido"/>
                        <i className="register-apellido"></i>
                    </section>
                    <section className="register-box">
                        <input type="text" name="mail" placeholder="Mail" />
                        <i className="register-mail"></i>
                    </section>
                    <section className="register-box">
                        <input type="number" name="edad" placeholder="Edad"/>
                        <i className="register-edad"></i>
                    </section>
                    <section className="register-box">
                        <input type="password" name="password" placeholder="Password"/>
                        <i className="register-password"></i>
                    </section>
                        <Link to="/" className="register-button"><p>Registrarme</p></Link>
               </form> 
          </main>
}

export default Register;