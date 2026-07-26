"use client";
import { createContext, useContext, useState, useMemo } from "react";

const CheckoutContext = createContext();

export default function CheckoutProvider({ children }) {
    const [checkoutItems, setCheckoutItems] = useState([]);
    const [coupon, setCoupon] = useState("");
    const [needShipping, setNeedShipping] = useState(true);

    const SHIPPING_PRICE = 5.5;
    const TAX_RATE = 0.10;

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