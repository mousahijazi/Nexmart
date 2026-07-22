"use client"
import {createContext, useContext, useState, useEffect} from 'react';
import { useAlertContext } from "./AlertProvider";
import { useUserContext } from './UserProvider';

const WishlistContext = createContext();

export default function WishlistProvider({children}) {
    const [wishlist, setWishlist] = useState([]);
    const [loadingWishlist, setLoadingWishlist] = useState(true);

    const {showAlert} = useAlertContext();
    const {user} = useUserContext();
    const wishlistKey = user?.id ? `wishlist-${user.id}` : "wishlist-guest";

    useEffect(() => {
        setLoadingWishlist(true);
        const storedWishlist = JSON.parse(localStorage.getItem(wishlistKey)) || [];

        setWishlist(storedWishlist);
        setLoadingWishlist(false);
    }, [wishlistKey]);
    
    useEffect(() => {
        localStorage.setItem(wishlistKey, JSON.stringify(wishlist));
    }, [wishlist, wishlistKey]);

    const isInWishlist = (productId) => {
        return wishlist.some(item => item.id === productId);
    };

    const addToWishlist = (product) => {
        if (!product) return;

        const exists = isInWishlist(product.id)
        if (exists) {
            showAlert(`${product.title} is already in your wishlist!`, "danger");
            return;
        }

        setWishlist(prev => [...prev, product]);
        showAlert(`${product.title} added to wishlist`);
    };

    const removeFromWishlist = (product) => {
        setWishlist(prev => prev.filter(item => item.id !== product.id));
        showAlert(`${product.title} removed from wishlist`, "danger");
    };

    const toggleWishlist = (product) => {
        if (!product) return;

        if (isInWishlist(product.id)) {
            removeFromWishlist(product);
        } else {
            addToWishlist(product);
        }
    };

    const value = {
        wishlist,
        loadingWishlist,
        isInWishlist,
        toggleWishlist,
    }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlistContext() {
  return useContext(WishlistContext);
}
