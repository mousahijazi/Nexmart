import { WishlistProducts, WhishlistText } from "@/index";
import { useTranslations } from "next-intl";

export default function Wishlist() {
  const t = useTranslations("wishlist");

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="text-[13px] text-[var(--color-muted)] mb-[18px]">{t("urlTitle")}</div>
      <WhishlistText />
      <div dir="ltr">
        <WishlistProducts />
      </div>
    </div>
  )
}
