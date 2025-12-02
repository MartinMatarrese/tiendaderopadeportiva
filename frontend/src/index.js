import React from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App";

if(window.location.pathname === "/" || !window.location.pathname.includes("/tiendaderopadeportiva")) {
    window.history.replaceState(null, null, "/tiendaderopdeportiva");
};
createRoot (document.getElementById("root")).render(
    <React.StrictMode>
        <App/>
    </React.StrictMode>
);