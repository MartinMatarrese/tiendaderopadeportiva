import { Link, NavLink } from "react-router-dom"
import { CartWidget } from "../CartWidget/CartWidjet"
import "./NavBar.css";
export const NavBar = () => {
    return (
        <nav className="menu">
            <Link to={"/"}><h2 className="menu-inicio">INICIO</h2></Link>
            <div className="menu-enlaces">
               <NavLink to={"category/camisetas"} className="menu-enlaces-categorias">CAMISETAS</NavLink>
               <NavLink to={"category/camperas"} className="menu-enlaces-categorias">CAMPERAS</NavLink>
               <NavLink to={"category/shorts"} className="menu-enlaces-categorias">SHORTS</NavLink>
            </div>
            <CartWidget/>
        </nav>
    )
}