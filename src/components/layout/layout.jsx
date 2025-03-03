import { Route, Routes, useLocation } from "react-router-dom"
import { NavBar } from "../NavBar/NavBar";
import Login from "../login/login";
import { ItemListContainer } from "../ItemListContainer/ItemListContainer";

const Layout = () => {
    const location = useLocation();
    if(location.pathname === "/login") {
        return (
            <Routes>
                <Route path="/login" element={<Login/>}/>
            </Routes>
        )
    }
    return (
        <>
            <Routes>
                <Route path="/" element={<ItemListContainer/>}/>
                <Route path="/login" element={<Login/>}/>
            </Routes>

        </>
    )

}

export default Layout