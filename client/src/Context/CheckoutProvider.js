"use client";
import { createContext, useContext, useState, useMemo, useEffect } from "react";
import { useUserContext } from "./UserProvider";
import { getBackendMyOrders, fetchCartPricing } from "../helper/fetchApi";

const CheckoutContext = createContext();

const STORAGE_KEY = "checkout-items";
const ORDER_STORAGE_KEY = "current-order-id";

export default function CheckoutProvider({ children }) {
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    const { user, loading: userLoading } = useUserContext();
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(true);
    const [ordersError, setOrdersError] = useState("");

    const [serverPricing, setServerPricing] = useState(null);
    const [checkoutPricingLoading, setCheckoutPricingLoading] = useState(false);
    const [checkoutPricingError, setCheckoutPricingError] = useState("");

    const [coupon, setCoupon] = useState("");

    useEffect(() => {
        try {
            const storedItems = sessionStorage.getItem(STORAGE_KEY);
            const storedOrderId = sessionStorage.getItem(ORDER_STORAGE_KEY);

            if (storedItems) {
                const parsedItems = JSON.parse(storedItems);

                if (Array.isArray(parsedItems)) {
                    setCheckoutItems(parsedItems);
                }
            }

            if (storedOrderId) {
                setCurrentOrderId(storedOrderId);
            }
        } catch (error) {
            console.error("Could not restore checkout data:", error);
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

    useEffect(() => {
        if (!isLoaded) return;

        if (currentOrderId) {
            sessionStorage.setItem(ORDER_STORAGE_KEY, currentOrderId);
        } else {
            sessionStorage.removeItem(ORDER_STORAGE_KEY);
        }
    }, [currentOrderId, isLoaded]);

    useEffect(() => {
        if (userLoading) return;

        if (!user) {
            setOrders([]);
            setOrdersError("");
            setOrdersLoading(false);
            return;
        }

        let cancelled = false;

        async function loadOrders() {
            setOrdersLoading(true);
            setOrdersError("");

            try {
                const token = localStorage.getItem("nexmart-token");

                if (!token) {
                    throw new Error("You must log in to view your orders");
                }

                const result = await getBackendMyOrders(token);

                if (!cancelled) {
                    setOrders(result.orders || []);
                }
            } catch (error) {
                if (!cancelled) {
                    setOrdersError(error.message || "Could not load orders");
                    setOrders([]);
                }
            } finally {
                if (!cancelled) {
                    setOrdersLoading(false);
                }
            }
        }

        loadOrders();

        return () => {
            cancelled = true;
        };
    }, [user, userLoading]);

    useEffect(() => {
        if (!isLoaded) return;

        if (checkoutItems.length === 0) {
            setServerPricing(null);
            setCheckoutPricingError("");
            setCheckoutPricingLoading(false);
            return;
        }

        const controller = new AbortController();

        const timer = setTimeout(async () => {
            setCheckoutPricingLoading(true);
            setCheckoutPricingError("");

            try {
                const items = checkoutItems.map((product) => ({
                    productId: String(product._id ?? product.productId ?? product.id),
                    quantity: Number(product.quantity || 1),
                }));

                const result = await fetchCartPricing(items, coupon, controller.signal);

                if (!controller.signal.aborted) {
                    setServerPricing(result);
                }
            } catch (error) {
                if (!controller.signal.aborted && error.name !== "AbortError") {
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
        if (!Array.isArray(cartProducts) || cartProducts.length === 0) {
            return;
        }

        setCheckoutItems(cartProducts);
    };

    const clearCheckout = () => {
        setCheckoutItems([]);
        setCurrentOrderId(null);
        setCoupon("");
        setServerPricing(null);
        setCheckoutPricingError("");
    };

    const totalItems = useMemo(() => 
        checkoutItems.reduce((total, item) => total + Number(item.quantity || 1), 0), [checkoutItems]
    );

    const subtotal = serverPricing?.totals?.subtotal ?? 0;
    const shippingPrice = serverPricing?.totals?.shipping ?? 0;
    const taxes = serverPricing?.totals?.tax ?? 0;
    const discountAmount = serverPricing?.coupon?.discount ?? 0;
    const grandTotal = serverPricing?.totals?.grandTotal ?? 0;

    const value = {
        checkoutItems,
        setCheckoutItems,

        currentOrderId,
        setCurrentOrderId,

        orders,
        setOrders,
        ordersLoading,
        ordersError,

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