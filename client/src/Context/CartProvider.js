"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useAlertContext } from "./AlertProvider";
import { useUserContext } from "./UserProvider";
import { useLocale } from "next-intl";
import { fetchCartPricing } from "@/helper/fetchApi";

const ProductsContext = createContext();

export default function ProductProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const [cartPricing, setCartPricing] = useState(null);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState("");

  const { showAlert } = useAlertContext();
  const { user } = useUserContext();
  const locale = useLocale();

  const cartKey = user?._id ? `cart-${user._id}` : "cart-guest";

  useEffect(() => {
    setLoadingCart(true);

    try {
      const storedCart = JSON.parse(localStorage.getItem(cartKey) || "[]");

      const normalizedCart = Array.isArray(storedCart)
        ? storedCart.map((product) => ({
            ...product,
            quantity: Math.max(1, Number.isInteger(product.quantity) ? product.quantity : 1),
          }))
        : [];

      setCart(normalizedCart);
    } catch {
      setCart([]);
    } finally {
      setLoadingCart(false);
    }
  }, [cartKey]);

  useEffect(() => {
    if (loadingCart) return;

    localStorage.setItem(cartKey, JSON.stringify(cart));
  }, [cart, cartKey, loadingCart]);

  useEffect(() => {
    if (loadingCart) return;

    if (cart.length === 0) {
      setCartPricing(null);
      setPricingError("");
      setPricingLoading(false);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setPricingLoading(true);
      setPricingError("");

      try {
        const items = cart.map((product) => ({
          productId: product._id,
          quantity: product.quantity || 1,
        }));

        const result = await fetchCartPricing(items, "", controller.signal);

        if (!controller.signal.aborted) {
          setCartPricing(result);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setPricingError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setPricingLoading(false);
        }
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [cart, loadingCart]);

  const addToStorage = (product) => {
    if (!product) return;

    const exists = cart.find((item) => item?._id === product?._id);
    if (exists) {
      showAlert(`${product?.title?.[locale]} has already in cart!`, "danger");
      return;
    }

    setCart((prev) => [
      ...prev,
      { ...product, quantity: 1 },
    ]);

    showAlert(`${product?.title?.[locale]} added to cart`);
  };

  const removeFromCart = (product) => {
    setCart((prev) => prev.filter((item) => item?._id !== product?._id));

    showAlert(`${product?.title?.[locale]} removed from cart`, "danger");
  };

  const increaseQuantity = (productId) => {
    setCart((prev) =>
      prev.map((product) => {
        if (String(product._id) !== String(productId)) {
          return product;
        }

        const quantity = product.quantity || 1;

        if (quantity >= product.stock) {
          showAlert("Requested quantity exceeds available stock", "danger");
          return product;
        }

        return {
          ...product,
          quantity: quantity + 1,
        };
      })
    );
  };

  const decreaseQuantity = (productId) => {
    setCart((prev) => 
      prev.map((product) => {
          if (String(product._id) !== String(productId)) {
            return product;
          }

          const quantity = product.quantity || 1;

          if (quantity <= 1) {
            return product; 
          }

          return {
            ...product,
            quantity: quantity - 1,
          };
        })
        .filter((product) => product.quantity > 0)
    );
  };

  const totalPrice = cartPricing?.totals?.subtotal ?? 0;
  const subtotal = cartPricing?.totals?.subtotal ?? 0;
  const taxes = cartPricing?.totals?.tax ?? 0;
  const shipping = cartPricing?.totals?.shipping ?? 0;
  const grandTotal = cartPricing?.totals?.grandTotal ?? 0;

  const value = {
    cart,
    setCart,
    removeFromCart,
    addToStorage,
    increaseQuantity,
    decreaseQuantity,
    loadingCart,

    cartPricing,
    pricingLoading,
    pricingError,

    totalPrice,
    subtotal,
    taxes,
    shipping,
    grandTotal,
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductContext() {
  return useContext(ProductsContext);
}
