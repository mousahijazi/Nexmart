"use client"
import { useProductContext } from "@/Context/CartProvider";
import { ProductsCard, Button, CartSkeleton } from "@/index";
import { useTranslations } from "next-intl";

export default function CartProducts() {
  const t = useTranslations();
  const {cart, loadingCart} = useProductContext();

  return (
    loadingCart 
      ? <CartSkeleton /> 
      : cart.length === 0 
        ? <div className="text-center py-20">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5B3A21] dark:text-[#F5EBE6]">
              {t("cart.emptyCart.title")}
            </h2>
            <p className="mt-3 text-gray-600 dark:text-[#e5ded8] md:text-lg">
              {t("cart.emptyCart.Desc")}
            </p>

            <Button title={t("cart.emptyCart.button")} link="products" />
        </div>
    :  <ProductsCard data={cart} showCard={false} />
  )
}
