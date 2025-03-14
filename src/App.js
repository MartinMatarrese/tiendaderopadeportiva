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
import Login from "./components/login/login";
import Register from "./components/Register/register";

function App (){
    return(
        <div>
            <BrowserRouter basename="/tiendaderopadeportiva">
                <Titulo/>
                <CartProvider>
                <NavBar/>
                <Routes>
                    <Route path="/" element={<ItemListContainer/>}/>
                    <Route path="/category/:categoryId" element={<ItemListContainer/>}/>
                    <Route path="/item/:itemId" element={<ItemDetailContainer/>}/>
                    <Route path="/Carrito" element={<Carrito/>}/>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="*" element={<Error/>}/>
                </Routes>
                </CartProvider>
                <Footer/>
            </BrowserRouter>
        </div>
    )
}
export default App;