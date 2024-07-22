'use client';
import { useEffect, useState } from "react";
import { createContext } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [userStatus, setUserStatus] = useState(false);

    useEffect(() => {
        setCartToState();
    }, []);

    const setCartToState = () => {
        const storedCart = localStorage.getItem("cart");
        setCart(storedCart ? JSON.parse(storedCart) : { cartItems: [] });
    };

    const addItemsToCart = async ({
        product,
        name,
        price,
        image,
        stock,
        seller,
        quantity = 1,
    }) => {
        const item = {
            product,
            name,
            price,
            image,
            stock,
            seller,
            quantity,
        };

        setCart(prevCart => {
            const isItemExists = prevCart?.cartItems?.find(i => i.product === item.product);

            let newCartItems;
            if (isItemExists) {
                newCartItems = prevCart.cartItems.map(i =>
                    i.product === isItemExists.product ? { ...i, quantity: item.quantity } : i
                );
            } else {
                newCartItems = [...(prevCart?.cartItems || []), item];
            }

            const updatedCart = { ...prevCart, cartItems: newCartItems };
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            return updatedCart;
        });

    };

    const deleteItemFromCart = (id) => {
        const newCartItems = cart?.cartItems?.filter((i) => i.product !== id);
        const updatedCart = { ...cart, cartItems: newCartItems };
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    return (
        <CartContext.Provider
            value={{ cart, addItemsToCart, deleteItemFromCart, setUserStatus, userStatus }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
