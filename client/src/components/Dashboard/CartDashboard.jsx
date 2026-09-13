import { CartDashboardData, BuyButton, CartTotal, ClearCartButton, CartAmount } from "../../index";
import { useTranslations } from "next-intl";

export default function CartDashboard() {
    const t = useTranslations();

  return (
    <div className="flex flex-col gap-[14px] lg:sticky lg:top-[130px]">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
            <div className="font-bold text-lg mb-[18px]">{t("checkout.addressPage.data.title")}</div>
            <CartDashboardData />
            <CartTotal />
            <div className="my-5 flex max-xs:flex-col items-center gap-3">
                <BuyButton products={true} />
                <ClearCartButton />
            </div>
            <div className="flex items-center justify-center gap-2 mt-[14px] text-xs text-[var(--color-muted)]">{t("home.hero.perks.pay.title")}</div>
        </div>
        <CartAmount />
    </div>
  )
}
