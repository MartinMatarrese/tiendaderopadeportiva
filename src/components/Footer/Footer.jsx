import React from "react";
import instagram from "../../image/instagram.png"
import facebook from "../../image/facebook.png"
import "./Footer.css";
export const Footer = () => {
    return (
        <div className="footer">
            <p>Nuestas redes:</p>
            <a href="https://www.instagram.com/" target="blank"><img className="redes" src={instagram} alt="instagram" /></a>
            <a href="https://www.facebook.com/" target="blank"><img className="redes" src={facebook} alt="facebook" /></a>
        </div>
    )
}