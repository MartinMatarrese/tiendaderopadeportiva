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

    useEffect(() => {
        if(!user) {
            setCart([]);
            setCartId(null);
        };

    }, [user]);

    // const getUserId = () => {
    //     if(user?._id || user?.id) {
    //         return user._id || user.id;
    //     };

    //     try {
    //         const storeUser = localStorage.getItem("user");
    //         if(storeUser) {
    //             const parsedUser = JSON.parse(storeUser);
    //             return parsedUser?._id || parsedUser?.id;
    //         };

    //     } catch (error) {
    //         console.error("Error parsing user form localStorage:", error);            
    //     };

    //     try {
    //         const sessionUser = sessionStorage.getItem("user");
    //         if(sessionUser) {
    //             const parsedUser = JSON.parse(sessionUser);
    //             return parsedUser?._id || parsedUser?.id;
    //         };

    //     } catch (error) {
    //         console.error("Error en parsing user from sessionStorage:", error);            
    //     };

    //     return null;
    // }

    // const userId = getUserId();

    // console.log("cartContext - userId obtenido:", {
    //     fromUserContext: user?._id,
    //     fromLocalStorage: localStorage.getItem("user"),
    //     finalUserId: userId
    // });
    

    const loadUserCart = useCallback(async() => {
        try {
            console.log("🛒 loadUserCart - INICIANDO:", { user: user?.email, userCart: user?.cart });

            if(!user || !user.cart) return;

            let userCartId;

            if(typeof user.cart === "object" && user.cart !== "null") {
                userCartId = user.cart._id
                console.log("user.cart es un objeto - ID:", userCartId);                
            } else if(typeof user.cart === "string") {
                userCartId = user.cart
                console.log("user.cart es string - ID:", userCartId);                
            } else {
                console.log("No hay carrito asociado al usuario");
                return;                
            }

            console.log("Cargando carrito con ID:", userCartId);
            

            const response = await axios.get(`${API_URL}/${userCartId}`, { withCredentials: true });

            console.log("Carrito cargado dedse BD:", response.data);
            
            setCartId(userCartId);
            setCart(response.data.products || response.data.items || []);
            console.log("🛒 loadUserCart - COMPLETADO:", { 
                cartId: userCartId, 
                cartItems: response.data.products || response.data.items || [] 
            });
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
        console.log("🛒 addItem - INICIANDO:", { item, cantidad, cartId, user })
        setError(false);

        if(!user) {
            setError("Debes iniciar sesión para agregar productos al carrito");
            return;
        };
        
        let  currentCartId = cartId;
        
        if(!currentCartId) {
            try {
                console.log("Creando nuevo carrito...");
                
                const response = await axios.post(API_URL, {}, { withCredentials: true });
                currentCartId = response.data._id || response.data.id;
                setCartId(currentCartId);
                console.log("Nuevo carrito creado:", currentCartId);
                
            } catch (error) {
                console.error("Error creando el carrito");
                
                setError("Error al crear el carrito")
                return;
            };
        };

        try {
            console.log("🛒 Agregando producto al carrito:", { currentCartId, itemId: item.id, cantidad });
            await axios.post(`${API_URL}/${currentCartId}/products/${item.id}`, { quantity: cantidad }, { withCredentials: true });
            console.log("Producto agregado a la BD - Recargando carrito completo...");
            
            const cartResponse = await axios.get(`${API_URL}/${currentCartId}`, {withCredentials: true})
            const fullCart = cartResponse.data.products || cartResponse.data.items || [];

            console.log("Carrito recargado desde BD: ", fullCart);
            
            setCart(fullCart);
            console.log("🛒 addItem - COMPLETADO:", { 
                currentCartId, 
                cartLength: fullCart.length,
                cartItems: fullCart 
            });

            // if(!isInCart(item.id)) {
            //     setCart(prev => [...prev, {...item, quantity: cantidad}]);
            // } else {
            //     setCart(prev => prev.map(prod => prod.id === item.id ? {...prod, quantity: (prod.quantity || prod.cantidad || 0)  + cantidad } : prod));
            // }
        } catch (error) {
            setError("Error agregando producto al carrito");
            console.error("Errorn agregando producto:", error);
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

    // const isInCart = (itemId) => {
    //     return (
    //         cart.some(prod => prod.id === itemId)
    //     );
    // };

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

    // const getUserIdFromUser = (user) => {
    //     if(!user) return null;

    //     if(user._id && user._id.$oid) {
    //         return user._id.$oid;
    //     };

    //     if(user._id && typeof user._id === "string") {
    //         return user._id;
    //     };

    //     if(user._id) {
    //         return user._id;
    //     };

    //     return null;
    // };

    // const userId = getUserIdFromUser(user);
    

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