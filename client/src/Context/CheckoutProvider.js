"use client";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useUserContext } from "./UserProvider";
import { getUserOrders, fetchCartPricing } from "../helper/fetchApi";

const CheckoutContext = createContext();
const STORAGE_KEY = "checkout-items";

export default function CheckoutProvider({ children }) {
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const {user} = useUserContext();
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);

    const [serverPricing, setServerPricing] = useState(null);
    const [checkoutPricingLoading, setCheckoutPricingLoading] = useState(false);
    const [checkoutPricingError, setCheckoutPricingError] = useState("");

    useEffect(() => {
        if (!user) {
            setOrders([]);
            setOrdersLoading(true);
            return;
        }

        setOrdersLoading(true);

        getUserOrders(user._id)
            .then((result) => {
                setOrders(result.orders || []);
            })
            .catch((error) => {
                console.error("Failed to fetch orders:", error);
                setOrders([]);
            })
            .finally(() => {
                setOrdersLoading(false);
            });
    }, [user]);

    useEffect(() => {
        const stored = sessionStorage.getItem("current-order-id");
        if (stored) {
            setCurrentOrderId(stored);
        }
    }, []);

    useEffect(() => {
        if (currentOrderId) {
            sessionStorage.setItem("current-order-id", currentOrderId);
        } else {
            sessionStorage.removeItem("current-order-id");
        }
    }, [currentOrderId]);

    const [coupon, setCoupon] = useState("");

    useEffect(() => {
        if (!isLoaded) return;

        if (checkoutItems.length === 0) {
            setServerPricing(null);
            setCheckoutPricingError("");
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {
            setCheckoutPricingLoading(true);
            setCheckoutPricingError("");

            try {
                const items = checkoutItems.map((product) => ({
                    productId: product._id,
                    quantity: product.quantity || 1,
                }));

                const result = await fetchCartPricing(items, coupon, controller.signal);

                if (!controller.signal.aborted) {
                    setServerPricing(result);
                }

            } catch (error) {
                if (error.name !== "AbortError") {
                    setCheckoutPricingError(error.message);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setCheckoutPricingLoading(false);
                }
            }
        }, 250);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [checkoutItems, coupon, isLoaded]);

    useEffect(() => {
        try {
            const stored = sessionStorage.getItem(STORAGE_KEY);
            if (stored) {
                setCheckoutItems(JSON.parse(stored));
            }
        } catch (error) {
            console.error("Failed to load checkout items:", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) return;

        if (checkoutItems.length > 0) {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(checkoutItems));
        } else {
            sessionStorage.removeItem(STORAGE_KEY);
        }
    }, [checkoutItems, isLoaded]);

    const checkoutSingleProduct = (product, quantity = 1) => {
        if (!product) return;

        setCheckoutItems([
            {
                ...product,
                quantity,
            },
        ]);
    };

    const checkoutCart = (cartProducts) => {
        if (!cartProducts || cartProducts.length === 0) return;

        setCheckoutItems(cartProducts);
    };

    const clearCheckout = () => {
        setCheckoutItems([]);
        setCurrentOrderId(null)
    };

    const subtotal = serverPricing?.totals?.subtotal ?? 0;
    const shippingPrice = serverPricing?.totals?.shipping ?? 0;
    const taxes = serverPricing?.totals?.tax ?? 0;
    const discountAmount = serverPricing?.coupon?.discount ?? 0;
    const grandTotal = serverPricing?.totals?.grandTotal ?? 0;
    const totalItems = serverPricing?.items.length;

    const value = {
        checkoutItems,
        setCheckoutItems,
        currentOrderId,
        setCurrentOrderId,

        orders,
        setOrders,
        ordersLoading,

        checkoutSingleProduct,
        checkoutCart,
        clearCheckout,
        
        coupon,
        setCoupon,

        serverPricing,
        checkoutPricingLoading,
        checkoutPricingError,

        totalItems,
        subtotal,
        shippingPrice,
        taxes,
        discountAmount,
        grandTotal,
    };

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    );
}

export function useCheckoutContext() {
    return useContext(CheckoutContext);
}