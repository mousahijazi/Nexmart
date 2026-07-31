"use client";
import { createContext, useContext, useState, useMemo, useEffect } from "react";

const CheckoutContext = createContext();
const STORAGE_KEY = "checkout-items";

export default function CheckoutProvider({ children }) {
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [currentOrderId, setCurrentOrderId] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

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
    const [needShipping, setNeedShipping] = useState(true);
    const [shippingInfo, setShippingInfo] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        city: "",
        address: "",
        notes: "",
    });
    const updateShippingField = (name, value) => {
        setShippingInfo(prev => ({ ...prev, [name]: value }));
    };

    const SHIPPING_PRICE = 5.5;
    const TAX_RATE = 0.10;

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

    const isShippingValid = () => {
        const { firstName, lastName, phone, city, address } = shippingInfo;
        return firstName.trim() && lastName.trim() && phone.trim() && city.trim() && address.trim();
    };

    // Calculations
    const subtotal = useMemo(() => {
        return checkoutItems.reduce((total, product) => {
            return total + product.price * (product.quantity || 1);
        }, 0);
    }, [checkoutItems]);

    const totalItems = useMemo(() => {
        return checkoutItems.reduce((total, product) => {
            return total + (product.quantity || 1);
        }, 0);
    }, [checkoutItems]);

    const shippingPrice = needShipping ? SHIPPING_PRICE : 0;
    const taxes = subtotal * TAX_RATE;


    const discountAmount = useMemo(() => {
        const code = coupon.trim().toLowerCase();
        switch (code) {
            case "mousa":
                return taxes;
            default:
                return 0;
        }
    }, [coupon, taxes]);

    const grandTotal = subtotal + shippingPrice + taxes - discountAmount;

    const value = {
        checkoutItems,
        setCheckoutItems,
        currentOrderId,
        setCurrentOrderId,

        shippingInfo,
        setShippingInfo,
        updateShippingField,
        isShippingValid,

        checkoutSingleProduct,
        checkoutCart,
        clearCheckout,
        
        coupon,
        setCoupon,
        needShipping,
        setNeedShipping,

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