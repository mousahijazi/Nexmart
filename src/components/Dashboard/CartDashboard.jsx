import { CartDashboardData, BuyButton, CartTotal, ClearCartButton, Coupon } from "@/index";
import { useTranslations } from "next-intl";

export default function CartDashboard() {
    const t = useTranslations();

  return (
    <div className="flex flex-col gap-[14px]">
        <div className="bg-white border border-[var(--color-border)] rounded-2xl p-6">
            <div className="font-bold text-lg mb-[18px]">{t("checkout.addressPage.data.title")}</div>

            {/* <Coupon /> */}

            <CartDashboardData />
            <CartTotal />
            <div className="my-5 flex max-xs:flex-col items-center gap-3">
                <BuyButton products={true} />
                <ClearCartButton />
            </div>
            <div className="flex items-center justify-center gap-2 mt-[14px] text-xs text-[var(--color-muted)]">{t("home.hero.perks.pay.title")}</div>
        </div>
        <div className="bg-[var(--color-sand)] rounded-2xl px-5 py-[18px] text-[13.5px] text-[var(--color-soft-2)] leading-[1.8]">أضف بـ <b className="text-[var(--color-green-dark)]">٤٥ ر.س</b> إضافية واحصل على شحن مجاني.</div>
    </div>
  )
}
