import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./UserContext";
import axios from "axios";

export const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cart, setCart] = useState([]);    
    const [cantidadTotal, setCantidadTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [ cartId, setCartId ] = useState(null);
    const [error, setError] = useState(false);
    const { user } = useAuth();
    const bacUrl = process.env.REACT_APP_BACK_URL;
    const API_URL = `${bacUrl}api/carts`;
    const userId = user?._id || user?.id;

    const loadUserCart = useCallback(async() => {
        try {
            if(!user || !user.cart) return;
            const response = await axios.get(`${API_URL}/${user.cart}`, { withCredentials: true });
            setCartId(user.cart);
            setCart(response.data.products || response.data.items || []);
        } catch (error) {
            console.error("Error cargando el carrito:", error);            
        }
    }, [user, API_URL]);

    useEffect(() => {
        loadUserCart();
    }, [loadUserCart])

    const getTotalQuantity = () => {
        return cart.reduce((total, item) => total + (item.quantity || item.cantidad || 0), 0);
    }

    const addItem = async(item, cantidad) => {
        console.log("Agregando producto:", item, "Cantidad:", cantidad);
        setError(false);

        if(!user) {
            setError("Debes iniciar sesión para agregar productos al carrito");
            return;
        };
        
        let  currentCartId = cartId;
        
        if(!currentCartId) {
            try {
                const response = await axios.post(API_URL, {}, { withCredentials: true });
                currentCartId = response.data._id || response.data.id;
                setCartId(currentCartId);
            } catch (error) {
                console.error("Error creando el carrito");
                
                setError("Error al crear el carrito")
                return;
            };
        };

        try {
            await axios.post(`${API_URL}/${currentCartId}/products/${item.id}`, { quantity: cantidad }, { withCredentials: true });
            if(!isInCart(item.id)) {
                setCart(prev => [...prev, {...item, quantity: cantidad}]);
            } else {
                setCart(prev => prev.map(prod => prod.id === item.id ? {...prod, quantity: (prod.quantity || prod.cantidad || 0)  + cantidad } : prod));
            }
        } catch (error) {
            setError("Error agregando producto al carrito");
            console.error("Error:", error);            
        };
    };

    const removeItem = async(itemId) => {
        if(!cartId) return;

        try {
           await axios.delete(`${API_URL}/${cartId}/products/${itemId}`, { withCredentials: true });
           setCart(prev => prev.filter(prod => prod.id !== itemId));
        } catch (error) {
            setError("Error al eliminar producto del carrito");
            console.error("Error: ", error);            
        };
    };

    const clearCart = async() => {
        if(!cartId) return;
        try {
            await axios.delete(`${API_URL}/${cartId}`, { withCredentials: true });
            setCart([]);
        } catch (error) {
            setError("Error al eliminar el carrito")
            console.error("Error:", error);            
        }
    };

    const isInCart = (itemId) => {
        return (
            cart.some(prod => prod.id === itemId)
        );
    };

    const updateItemQuantity = async(itemId, newQuantity) => {
        if(!cartId) return;
        try {
            await axios.put(`${API_URL}/${cartId}/products/${itemId}`, { quantity: newQuantity }, { withCredentials: true });
            setCart(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item ));
        } catch (error) {
            setError("Error al actualizar la cantidad");
            console.error("Error: ", error);            
        }
    };

    useEffect(() => {        
        const cantidadTotal = cart.reduce((acc, prod) => acc + (prod.quantity || prod.cantidad || 0), 0)
        setCantidadTotal(cantidadTotal);
        const precioTotal = cart.reduce((acc, prod) => acc + (prod.price * (prod.quantity || prod.cantidad || 0)), 0)
        setTotal(precioTotal)
    }, [cart]);

    return (
        <CartContext.Provider value={{cart, cartId, userId, addItem, removeItem, clearCart, cantidadTotal, total, error, updateItemQuantity, getTotalQuantity}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if(!context) {
        throw new Error("useCart debe usarse dentro de cartProvider");
    }

    return context;
};