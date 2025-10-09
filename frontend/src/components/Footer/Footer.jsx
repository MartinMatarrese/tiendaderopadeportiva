import React from "react";
import instagram from "../../image/instagram.svg"
import facebook from "../../image/facebook.svg"
import "./Footer.css";
export const Footer = () => {
    const año = new Date().getFullYear();
    return (
        <div className="footer">
            <p>Nuestas redes:</p>
            <a href="https://www.instagram.com/" target="blank"><img className="redes" src={instagram} alt="instagram" /></a>
            <a href="https://www.facebook.com/" target="blank"><img className="redes" src={facebook} alt="facebook" /></a>
            <div className="derechos">
                <p>@{año}. Todos los derechos resevados.</p>
            </div>
        </div>
    )
}