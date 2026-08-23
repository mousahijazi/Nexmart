import { Link } from "@/lib/i18n/routing";
import { CartProducts } from "@/index";
import { useTranslations } from "next-intl";

export default function Cart() {
  const t = useTranslations();

  return (
   <div className="bg-white border border-[var(--color-border)] rounded-2xl overflow-hidden">
      <CartProducts />
      <div className="px-5 py-[18px] flex justify-between items-center flex-wrap gap-2">
        <Link href="/products" className="text-sm text-[var(--color-green)] font-semibold cursor-pointer">{t("cart.button")}</Link>
        <div className="text-[13px] text-[var(--color-muted)]">{t("cart.Desc")}</div>
      </div>
    </div>
  )
}
