import instagram from "../../image/instagram.svg"
import facebook from "../../image/facebook.svg"
import "./Footer.css";

export const Footer = () => {
    const año = new Date().getFullYear();
    return (
        <div className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h4>Síguenos en redes</h4>
                    <div className="social-links">
                        <a href="https://www.instagram.com/martin_matarrese/" target="blank"><img className="social-icon" src={instagram} alt="instagram" /><span>Instagram</span></a>
                        <a href="https://www.facebook.com/elrojo94?locale=es_LA" target="blank"><img className="social-icon" src={facebook} alt="facebook"/><span>Facebook</span></a>
                    </div>
                </div>
            </div>    
            <div className="footer-bottom">
                <div className="copyright">
                    <p>@{año}. Tienda de Ropa Deportiva. Todos los derechos resevados.</p>
                </div>
            </div>
        </div>
    )
};