import { Link, NavLink, useNavigate } from "react-router-dom"
import { CartWidget } from "../CartWidget/CartWidjet"
import "./NavBar.css";
import users from "../../image/icons8-usuario-48.png"
import { useAuth } from "../Context/UserContext";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

export const NavBar = () => {
    const { user, logout, loading } = useAuth();
    const [ dropdownOpen, setDropdownOpen ] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            };
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <nav className="menu"> 
           <Link to={"/"}><span className="logo">TDR</span></Link>
            <div className="menu-enlaces">
                <NavLink to={"category/camisetas"} className="menu-enlaces-categorias">CAMISETAS</NavLink>
                <NavLink to={"category/camperas"} className="menu-enlaces-categorias">CAMPERAS</NavLink>
                <NavLink to={"category/shorts"} className="menu-enlaces-categorias">SHORTS</NavLink>
                <NavLink to={"category/botines"} className="menu-enlaces-categorias">BOTINES</NavLink>
            </div>
            { loading ? (
                <div className="cont-user">
                    <ClipLoader size={25} color="#3498db"/>
                </div> 
            ) : user ? (
                <div className="cont-user">
                    <div className="user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <h4 className="user">{user.first_name} {user.last_name}</h4>
                        <img className="users" src={users} alt="usuario"/>
                    </div>
                    {dropdownOpen && (
                        <ul className="dropdown-menu">
                            <Link to={"/"}>Inicio</Link>
                            <li onClick={() => logout(navigate) }>Cerrar sessión</li>
                        </ul>
                    )}
                </div>
            ) : (
                <Link to="/login" className="login-link">
                    <h4 className="user">Login</h4>
                    <img className="users" src={users} alt="usuario"/>
                </Link>
            )}            
            <CartWidget/>
        </nav>
    )
};