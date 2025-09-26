// context/CartContext.js
import { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // Di sini kita bisa pindahkan semua logic `addToCart`, `removeFromCart`, dll.
  const addToCart = (productToAdd) => {
    const existingProduct = cart.find((item) => item._id === productToAdd._id);
    if (existingProduct) {
      setCart(cart.map((item) =>
        item._id === productToAdd._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...productToAdd, quantity: 1 }]);
    }
  };

  const value = { cart, addToCart };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}