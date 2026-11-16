"use client";
import { useProductContext } from "../../Context/CartProvider";
import { useTranslations } from "next-intl";

export default function CartDashboardData() {
  const t = useTranslations();
  const { cart, totalPrice, grandTotal, taxes, shipping, cartItemsCount, pricingLoading } = useProductContext();

  const categoriesCount = new Set(cart.map((product) => product.category)).size;

  const data = [
    {
      title: t("cart.cartDashboard.dashboardData.products"),
      value: cartItemsCount,
      isDynamic: false,
    },
    {
      title: t("cart.cartDashboard.dashboardData.price"),
      value: `${totalPrice.toFixed(2)}`,
      isDynamic: true,
    },
    {
      title: t("cart.cartDashboard.dashboardData.categories"),
      value: categoriesCount,
      isDynamic: false,
    },
    {
      title: t("cart.cartDashboard.dashboardData.taxes"),
      value: `${taxes.toFixed(2)}`,
      isDynamic: true,
    },
    {
      title: t("cart.cartDashboard.dashboardData.shipping"),
      value: `${shipping.toFixed(2)}`,
      isDynamic: true,
    },
    {
      title: t("cart.cartDashboard.dashboardData.total"),
      value: `${grandTotal.toFixed(2)}`,
      isDynamic: true,
    },
  ];

  return (
    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 w-full">
      {data.map((ele, index) => (
        <div key={index} className="flex justify-between items-center text-sm py-2 text-[var(--color-soft)]">
          <span>{ele.title}</span>
          <span className={`font-medium transition-opacity duration-200 ${ele.isDynamic && pricingLoading ? "opacity-40" : "opacity-100"}`}>
            {ele.value}
          </span>
        </div>
      ))}
    </div>
  );
}