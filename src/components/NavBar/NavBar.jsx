import { Link, NavLink } from "react-router-dom"
import { CartWidget } from "../CartWidget/CartWidjet"
import "./NavBar.css";
import users from "../../image/icons8-usuario-48.png"

export const NavBar = () => {
    return (
        <nav className="menu"> 
           <Link to={"/"}><span className="logo">TDR</span></Link>
            <div className="menu-enlaces">
                <NavLink to={"category/camisetas"} className="menu-enlaces-categorias">CAMISETAS</NavLink>
                <NavLink to={"category/camperas"} className="menu-enlaces-categorias">CAMPERAS</NavLink>
                <NavLink to={"category/shorts"} className="menu-enlaces-categorias">SHORTS</NavLink>
            </div>
            <Link to="/login"><span><img className="users" src={users} alt="usuario" /></span></Link>
            <CartWidget/>
        </nav>
    )
}