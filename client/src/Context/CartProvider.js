"use client"
import {createContext, useContext, useState, useEffect} from 'react';
import { useAlertContext } from "./AlertProvider";
import { useUserContext } from './UserProvider';
import { useLocale } from 'next-intl';

const ProductsContext = createContext();

export default function ProductProvider({children}) {
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true)
  const {showAlert} = useAlertContext();
  const {user} = useUserContext();
  const cartKey = user?.id ? `cart-${user.id}` : "cart-guest";
  const locale = useLocale();

  useEffect(() => {
    setLoadingCart(true);
    
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
    setCart(storedCart);
    setLoadingCart(false);
  }, [cartKey]);

  const addToStorage = (product) => {
      if (!product) return;

      const exists = cart.find(item => item?._id === product?._id);
      if (exists) {
        showAlert(`${product?.title?.[locale]} has already in cart!`, "danger");
        return 
      } 
      
      setCart(prev => [...prev, product]);
      showAlert(`${product?.title?.[locale]} added to cart`);
  }

  const removeFromCart = (product) => {
      setCart(prev => prev.filter(item => item?._id !== product?._id));
      showAlert(`${product?.title?.[locale]} removed from cart`, "danger");
  };

  let totalPrice = cart.reduce((total, product) => total + product?.price, 0);

  const value = {
      cart, 
      setCart,
      removeFromCart,
      addToStorage,
      loadingCart,
      totalPrice,
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
