import { useNavigate } from "react-router-dom";
import "./register.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export const Register = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        email: "",
        age: "",
        password: ""
    });
    const [error, setError] = useState(false);
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            const url = "http://localhost:8080/users/register";
            await axios.post(url, formData);
            Swal.fire({
            position: "center",
            icon: "success",
            title: "Registado con éxito",
            showConfirmButton: false,
            timer: 1500
          });
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

    return <main className="register-main">
               <form className="register-container" onSubmit={handleSubmit}>
                   <h1 className="register-titulo">Registrarse</h1> 
                    <section className="register-box">
                        <input type="text" name="first_name" placeholder="Nombre" value={formData.first_name} onChange={handleChange} required/>
                        <i className="register-nombre"></i>
                    </section>
                    <section className="register-box">
                        <input type="text" name="last_name" placeholder="Apellido" value={formData.last_name} onChange={handleChange} required/>
                        <i className="register-apellido"></i>
                    </section>
                    <section className="register-box">
                        <input type="text" name="email" placeholder="Mail" value={formData.email} onChange={handleChange} required/>
                        <i className="register-mail"></i>
                    </section>
                    <section className="register-box">
                        <input type="number" name="age" placeholder="Edad" value={formData.age} onChange={handleChange} required/>
                        <i className="register-edad"></i>
                    </section>
                    <section className="register-box">
                        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required/>
                        <i className="register-password"></i>
                    </section>
                        <button type="submit" className="register-button"><p>Registrarme</p></button>
                        {error && <p>Hubo un error al registrar el usuario.</p>}
               </form> 
          </main>
};