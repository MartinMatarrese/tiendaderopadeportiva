import { Link, NavLink, useNavigate } from "react-router-dom"
import { CartWidget } from "../CartWidget/CartWidjet"
import "./NavBar.css";
import users from "../../image/icons8-usuario-48.png"
import { useAuth } from "../Context/UserContext";
import { useEffect, useRef, useState } from "react";
import { ClipLoader } from "react-spinners";

export const NavBar = () => {
    const { user, logout, loading, timeLeft, startSessionTimer, isAuthenticated} = useAuth();
    const [ dropdownOpen, setDropdownOpen ] = useState(false);
    const [ adminDropdownOpen, setAdminDropdownOpen ] = useState(false);
    const dropdownRef = useRef(null);
    const adminDropdownRef = useRef(null);
    const navigate = useNavigate();

    const formatTime = (seconds) => {
        if(!seconds || seconds < 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const reamingSeconds = seconds % 60;
        return `${minutes}:${reamingSeconds < 10 ? "0" : ""}${reamingSeconds}`
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if(dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            };

            if(adminDropdownRef.current && !adminDropdownRef.current.contains(event.target)) {
                setAdminDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        logout(navigate);
        setDropdownOpen(false);
        setAdminDropdownOpen(false);
    };

    const toggleAdminDropdown = () => {
        setAdminDropdownOpen(!adminDropdownOpen);
        setDropdownOpen(false)
    }

    useEffect(() => {
        console.log("🔍 NavBar Debug:", {
            user: user,
            isAuthenticated: isAuthenticated,
            loading: loading,
            userRole: user?.role,
            isAdmin: user?.role === "admin"
        });
    }, [user, isAuthenticated, loading]);

    if(loading) {
        return (
            <nav className="menu"> 
                <Link to={"/"}><span className="logo">TDR</span></Link>
                <div className="menu-enlaces">
                    <NavLink to={"category/camisetas"} className="menu-enlaces-categorias">CAMISETAS</NavLink>
                    <NavLink to={"category/camperas"} className="menu-enlaces-categorias">CAMPERAS</NavLink>
                    <NavLink to={"category/shorts"} className="menu-enlaces-categorias">SHORTS</NavLink>
                    <NavLink to={"category/botines"} className="menu-enlaces-categorias">BOTINES</NavLink>
                </div>
                <div className="cont-user">
                    <ClipLoader size={25} color="#3498db"/>
                </div> 
            </nav>
        )
    };
    
    return (
        <nav className="menu">
            <Link to={"/"}><span className="logo">TDR</span></Link>
            
            <div className="menu-enlaces">
                <NavLink to={"category/camisetas"} className="menu-enlaces-categorias">CAMISETAS</NavLink>
                <NavLink to={"category/camperas"} className="menu-enlaces-categorias">CAMPERAS</NavLink>
                <NavLink to={"category/shorts"} className="menu-enlaces-categorias">SHORTS</NavLink>
                <NavLink to={"category/botines"} className="menu-enlaces-categorias">BOTINES</NavLink>
                
                {isAuthenticated && user && user.role === "admin" && (
                    <div className="admin-nav-item" ref={adminDropdownRef}>
                        <button className="menu-enlaces-categorias admin-link" onClick={toggleAdminDropdown}>
                            🛠️ ADMIN
                        </button>

                        {adminDropdownOpen && (
                            <div className="admin-dropdown">
                                <Link to={"/admin"} className="admin-dropdown-item" onClick={() => setAdminDropdownOpen(false)}>
                                    📦 Panel de Administrador
                                </Link>
                                <Link to={"/admin/create-product"} className="admin-dropdown-item" onClick={() => setAdminDropdownOpen(false)}>+ Crear producto</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isAuthenticated && user ? (
                <div className="cont-user" ref={dropdownRef}>
                    <div className="user-trigger" onClick={() => setDropdownOpen(!dropdownOpen)}>
                        <h4 className="user">{user.first_name} {user.last_name}</h4>
                        <img className="users" src={users} alt="usuario" />
                        {user.role === "admin" && <span className="admin-badge">🛠️</span>}
                    </div>
                    
                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <Link to={"/"} onClick={() => setDropdownOpen(false)}>🏠 Inicio</Link>
                            {user.role === "admin" && (
                                <Link to="/admin" onClick={() => setDropdownOpen(false)}>🛠️ Panel Admin</Link>
                            )}
                            <button onClick={handleLogout} className="logout-btn">🚪 Cerrar Sesión</button>
                        </div>
                    )}
                </div>
            ) : (
                <Link to="/login" className="login-link">
                    <h4 className="user">Login</h4>
                    <img className="users" src={users} alt="usuario" />
                </Link>
            )}

            <div className="nav-right-container">
                {user && (
                    <div className="nav-timer">
                        <span className="nav-timer-icon">⏱️</span>
                        <span className="nav-timer-text">
                            {formatTime(timeLeft)}
                        </span>
                        {timeLeft <= 300 && (
                            <button 
                                className="nav-extend-btn" 
                                onClick={startSessionTimer} 
                                title="Extender sesión"
                            >
                                +
                            </button>
                        )}
                    </div>
                )}
                <CartWidget />
            </div>
        </nav>
    );
};