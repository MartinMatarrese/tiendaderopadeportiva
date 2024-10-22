import { Link, NavLink } from "react-router-dom"
import { CartWidget } from "../CartWidget/CartWidjet"
import "./NavBar.css";
import logo from "../../image/TD.png";
import { useState } from "react";
export const NavBar = () => {
    return (
        <nav className="menu"> 
           <Link to={"/"}><h2><img className="menu-inicio" src={logo} alt="logo" /></h2></Link>
            <div className="menu-enlaces">
                <NavLink to={"category/camisetas"} className="menu-enlaces-categorias">CAMISETAS</NavLink>
                <NavLink to={"category/camperas"} className="menu-enlaces-categorias">CAMPERAS</NavLink>
                <NavLink to={"category/shorts"} className="menu-enlaces-categorias">SHORTS</NavLink>
            </div>
            <CartWidget/>
        </nav>
    )
}