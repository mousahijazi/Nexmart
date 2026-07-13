"use client"
import {createContext, useContext, useState, useEffect} from 'react';
import { useAlertContext } from "./AlertProvider";
import { useUserContext } from './UserProvider';

const ProductsContext = createContext();

export default function ProductProvider({children}) {
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true)
  const {showAlert} = useAlertContext();
  const {user} = useUserContext();
  const cartKey = user?.id ? `cart-${user.id}` : "cart-guest";

  useEffect(() => {
    setLoadingCart(true);
    
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(storedCart);
    setLoadingCart(false);
  }, [cartKey]);

  const addToStorage = (product) => {
        if (!product) return;

        const exists = cart.find(
            item => item.id === product.id
        );

        if (exists) {
          showAlert(`${product.title} has already in cart!`, "danger");
          return 
        } 
        
        setCart(prev => [...prev, product]);
        showAlert(`${product.title} added to cart`);
  }

  const removeFromCart = (product) => {
      setCart(prev =>
          prev.filter(item => item.id !== product.id)
      );

      showAlert(`${product.title} removed from cart`, "danger");
  };

  const value = {
      cart, 
      setCart,
      removeFromCart,
      addToStorage,
      loadingCart,
  }

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey]);

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useProductContext() {
  return useContext(ProductsContext);
}
