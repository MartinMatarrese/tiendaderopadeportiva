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
import { Login } from "./components/login/login";
import { Register } from "./components/Register/register";
import { AuthProvider } from "./components/Context/UserContext";
import ForgotPassword from "./components/login/forgotPassword";
import ResetPassword from "./components/login/resetPassword";
import { ProtectedRoute } from "./components/ProtectedRoute/ProtectedRoute";
import CheckoutPage from "./components/Checkout/checkoutPage";

const basePath = window.location.pathname.includes("/tiendaderopadeportiva") ? "/tiendaderopadeportiva" : "";

function App (){
    return(
        <div>
            <AuthProvider>
                <BrowserRouter basename={basePath}>
                    <Titulo/>
                    <CartProvider>
                    <NavBar/>
                    <Routes>
                        <Route path="/" element={<ItemListContainer/>}/>
                        <Route path="/category/:categoryId" element={<ItemListContainer/>}/>
                        <Route path="/item/:itemId" element={
                            <ProtectedRoute>
                                <ItemDetailContainer/>
                            </ProtectedRoute>}/>
                        <Route path="/Carrito" element={<Carrito/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/forgot-password" element={<ForgotPassword/>}/>
                        <Route path="/reset-password" element={<ResetPassword/>}/>
                        <Route path="/checkout" element={<CheckoutPage/>}/>
                        <Route path="*" element={<Error/>}/>
                    </Routes>
                    </CartProvider>
                    <Footer/>
                </BrowserRouter>
            </AuthProvider>
        </div>
    )
}
export default App;