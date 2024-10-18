import "./App.css";
import { Titulo } from "./components/Titulo/Titulo";
import { NavBar } from "./components/NavBar/NavBar";
import { ItemListContainer } from "./components/ItemListContainer/ItemListContainer";
import { ItemDetailContainer } from "./components/ItemDetailContainer/ItemDetailContainer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Error from "./pages/Error";
import { CartProvider } from "./components/Context/CartContext";
import Carrito from "./components/Carrito/Carrito";
import { Footer } from "./components/Footer/Footer";

function App (){
    return(
        <div>
            <BrowserRouter>
                <Titulo/>
                <CartProvider>
                <NavBar/>
                <Routes>
                    <Route path="/" element={<ItemListContainer/>}/>
                    <Route path="/category/:categoryId" element={<ItemListContainer/>}/>
                    <Route path="/item/:itemId" element={<ItemDetailContainer/>}/>
                    <Route path="/Carrito" element={<Carrito/>}/>
                    <Route path="*" element={<Error/>}/>
                </Routes>
                </CartProvider>
                <Footer/>
            </BrowserRouter>
        </div>
    )
}
export default App;

// Lo que sucede es que GitHub, por defecto, muestra el contenido del README.md en la página principal de tu repositorio cuando visitas su URL. Para que tu proyecto se vea como una página web y no como el contenido del README, debes utilizar GitHub Pages.

// Aquí te explico cómo hacerlo:

// 1. Subir el proyecto al repositorio
// Asegúrate de que tu proyecto está subido correctamente a GitHub, incluyendo los archivos de tu aplicación (no solo el README). Esto incluye el directorio build o dist, dependiendo de cómo lo compilas, si estás usando React o algún otro framework.

// 2. Configurar GitHub Pages
// GitHub Pages te permite desplegar un sitio estático directamente desde tu repositorio. Si usas React, sigue estos pasos para desplegarlo:

// Para proyectos React:
// Instalar gh-pages: Si no lo has hecho ya, instala el paquete gh-pages para desplegar tu aplicación. En la raíz de tu proyecto (donde está el package.json), corre el siguiente comando:

// bash
// Copiar código
// npm install gh-pages --save-dev
// Configurar el package.json:

// Añade la siguiente línea en el package.json bajo el objeto scripts para que puedas hacer deploy fácilmente:
// json
// Copiar código
// "scripts": {
//   "predeploy": "npm run build",
//   "deploy": "gh-pages -d build"
// }
// Además, debes especificar la URL del repositorio en una propiedad llamada homepage en el package.json:
// json
// Copiar código
// "homepage": "https://<tu-usuario>.github.io/<nombre-del-repo>"
// Hacer el Deploy: Una vez que hayas configurado el package.json, puedes hacer el deploy con el siguiente comando:

// bash
// Copiar código
// npm run deploy
// Esto creará la carpeta build y subirá tu proyecto a GitHub Pages.

// Activar GitHub Pages en el repositorio:

// Ve a tu repositorio en GitHub.
// Haz clic en Settings.
// Desplázate hacia abajo hasta la sección Pages.
// En Source, selecciona la rama gh-pages o la rama main si has subido el contenido estático directamente.
// Guarda los cambios.
// 3. Acceder a tu sitio
// Una vez que hayas configurado GitHub Pages y hecho el deploy, podrás acceder a tu sitio web desde la URL:

// php
// Copiar código
// https://<tu-usuario>.github.io/<nombre-del-repo>
// De esta manera, cuando visites esa URL, tu aplicación se mostrará en lugar del README.md.

// Si necesitas más ayuda con algún paso, dime y lo ajustamos para tu proyecto específico.
