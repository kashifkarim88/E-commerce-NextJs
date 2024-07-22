import { CartProvider } from "./components/context/CartContext";

export function GlobalProvider({ children }) {
    return (
        <CartProvider>
            {
                children
            }
        </CartProvider>
    )
}