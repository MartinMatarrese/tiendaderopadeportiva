import "./App.css";
import { Titulo } from "./components/Titulo/Titulo";
import { NavBar } from "./components/NavBar/NavBar";
import { ItemListContainer } from "./components/ItemListContainer/ItemListContainer";
import { ItemDetailContainer } from "./components/ItemDetailContainer/ItemDetailContainer";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
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
import { PaymentSuccess } from "./components/Payment/PaymentSuccess";
import { PaymentFailure } from "./components/Payment/PaymentFailure";
import { PaymentPending } from "./components/Payment/PaymentPending";
import { VerifyEmail } from "./components/VerifyEmail/VerifyEmail";
import { AdminPanel } from "./components/AdminPanel/AdminPanel";
import { CreateProduct } from "./components/AdminPanel/CreateProduct";

// const basePath = window.location.pathname.includes("/tiendaderopadeportiva") ? "/tiendaderopadeportiva" : "";

function App (){
    return (
        <div>
            <AuthProvider>
                <Router>
                    <Titulo/>
                    <CartProvider>
                    <NavBar/>
                    <Routes>
                        <Route path="/" element={<ItemListContainer/>}/>
                        <Route path="/category/:categoryId" element={<ItemListContainer/>}/>
                        <Route path="/admin" element={<AdminPanel/>}/>
                        <Route path="/admin/create-product" element={<CreateProduct/>}/>
                        <Route path="/item/:itemId" element={
                            <ProtectedRoute>
                                <ItemDetailContainer/>
                            </ProtectedRoute>}/>
                        <Route path="/Carrito" element={<Carrito/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/verify-email/:token" element={<VerifyEmail/>}/>
                        <Route path="/forgot-password" element={<ForgotPassword/>}/>
                        <Route path="/reset-password" element={<ResetPassword/>}/>
                        <Route path="/checkout" element={<CheckoutPage/>}/>
                        <Route path="/payments/success" element={<PaymentSuccess/>}/>
                        <Route path="/payments/failure" element={<PaymentFailure/>}/>
                        <Route path="/payments/pending" element={<PaymentPending/>}/>
                        <Route path="*" element={<Error/>}/>
                    </Routes>
                    </CartProvider>
                    <Footer/>
                </Router>
            </AuthProvider>
        </div>
    )
}
export default App;