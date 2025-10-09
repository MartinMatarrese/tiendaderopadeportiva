import { Link } from "react-router-dom";
function Error (){
    return (
        <main>
            <h1 className="error">ERROR 404</h1>
            <p className="error-texto">Página no encontrada</p>
            <Link className="error-volver" to="/">Volver</Link>
        </main>
    )
}
export default Error;