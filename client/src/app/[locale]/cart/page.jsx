import { Cart, Dashbaord } from "../../../index";
import { useTranslations } from "next-intl";

export const metadata = {
  title: "Nexmart - cart",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default function CartPage() {
  const t = useTranslations();

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="text-[13px] text-[var(--color-muted)] mb-[18px]">{t("cart.title")}</div>
      <h1 className="font-bold text-[30px] mb-6 text-[var(--color-green-dark)]">{t("cart.secondTitle")}</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">
        <Cart />
        <Dashbaord />
      </div>
    </div>
  )
}
