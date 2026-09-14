"use client"
import {createContext, useContext, useState, useEffect} from 'react';
import { useAlertContext } from "./AlertProvider";
import { useProductContext } from './CartProvider';
import { useUserContext } from './UserProvider';
import { useLocale } from 'next-intl';

const WishlistContext = createContext();

export default function WishlistProvider({children}) {
    const [wishlist, setWishlist] = useState([]);
    const [loadingWishlist, setLoadingWishlist] = useState(true);
    const locale = useLocale();

    const {showAlert} = useAlertContext();
    const {user} = useUserContext();
    const {setCart} = useProductContext();
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
        return wishlist.some(item => item._id === productId);
    };

    const addToWishlist = (product) => {
        if (!product) return;

        const exists = isInWishlist(product._id)
        if (exists) {
            showAlert(`${product?.title?.[locale]} is already in your wishlist!`, "danger");
            return;
        }

        setWishlist(prev => [...prev, product]);
        showAlert(`${product?.title?.[locale]} added to wishlist`);
    };

    const resetWishlist = () => {
        if (wishlist.length === 0) {
            showAlert("Your wishlist is empty", "danger");
            return;
        }

        setWishlist([]);
        showAlert("Favorites cleared", "danger");
    }

    const moveToCart = () => {
        if (wishlist.length === 0) {
            showAlert("Your wishlist is empty", "danger");
            return;
        }

        setCart(prev => [...prev, ...wishlist]);
        setWishlist([]);

        showAlert("Products moved successfully to cart");
    }

    const removeFromWishlist = (product) => {
        setWishlist(prev => prev.filter(item => item?._id !== product?._id));
        showAlert(`${product?.title?.[locale]} removed from wishlist`, "danger");
    };

    const toggleWishlist = (product) => {
        if (!product) return;

        if (isInWishlist(product?._id)) {
            removeFromWishlist(product);
        } else {
            addToWishlist(product);
        }
    };

    const value = {
        wishlist,
        loadingWishlist,
        moveToCart,
        resetWishlist,
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
