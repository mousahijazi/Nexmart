"use client"
import { useWishlistContext } from "@/Context/WishlistProvider";
import { useTranslations, useLocale } from "next-intl";

export default function WhishlistText() {
    const t = useTranslations("wishlist");
    const locale = useLocale();
    const {wishlist, resetWishlist, moveToCart} = useWishlistContext(); 

  return (
    <div className="flex items-end justify-between mb-6 gap-[14px] flex-wrap">
        <div>
          <h1 className="font-bold text-[30px] text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">{t("title")}</h1>
          <p className="mt-2 text-[var(--color-muted)] text-sm"><span className={`${locale === "ar" ? "ml-2" : "mr-2"}`}>{wishlist.length}</span>{t("Desc")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" aria-label="reset wishlist" className="border border-[var(--color-field)] bg-white rounded-[11px] px-[18px] py-[11px] text-sm cursor-pointer hover:border-[var(--color-red)] hover:text-[var(--color-red)]" onClick={resetWishlist}>تفريغ القائمة</button>
          <button type="button" aria-label="merge with cart" className="bg-[var(--color-green)] text-white rounded-[11px] px-[22px] py-[11px] text-sm cursor-pointer hover:bg-[var(--color-green-dark)] transition-all duration-300" onClick={moveToCart}>أضف الكل للسلة</button>
        </div>
    </div>
  )
}
