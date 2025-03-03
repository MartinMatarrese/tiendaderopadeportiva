import { createContext, useEffect, useState } from "react";

export const CartContext = createContext({
    cart: [],
    cantidadTotal: 0,
    total: 0
});

export const CartProvider = ({children}) => {
    const [cart, setCart] = useState([]);
    const [cantidadTotal, setCantidadTotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(false);

    const addItem = (item, cantidad) => {
        if(!isInCart(item.id)) {
            setCart(prev => [...prev, {...item, cantidad}])
        }
        else{
            setError("El producto ya fue agregado")
        }
    };

    const removeItem = (itemId) => {
        const cartRemove = cart.filter(prod => prod.id !== itemId)
        setCart(cartRemove)
    };

    const clearCart = () => {
        setCart([])
    };

    const isInCart = (itemId) => {
        return (
            cart.some(prod => prod.id === itemId)
        );
    };
    useEffect(() => {
        console.log("Contenido del carrito", cart);
        
        const cantidadTotal = cart.reduce((acc, prod) => acc + prod.cantidad, 0)
        setCantidadTotal(cantidadTotal);
        const precioTotal = cart.reduce((acc, prod) => acc + (prod.price * prod.cantidad), 0)
        setTotal(precioTotal)
    }, [cart]);

    return (
        <CartContext.Provider value={{cart, addItem, removeItem, clearCart, cantidadTotal, total, error}}>
            {children}
        </CartContext.Provider>
    );
}