"use client"
import { useProductContext } from "../../Context/CartProvider";
import { Button, CartSkeleton, ShowCard, ProductsWishlistIcon } from "../../index";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedField } from "../../lib/locale";
import { Link } from "../../lib/i18n/routing";
import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/helper/getImage";

const INITIAL_VISIBLE = 4;

export default function CartProducts() {
  const t = useTranslations();
  const locale = useLocale();
  const {cart, loadingCart} = useProductContext();
  const [showAll, setShowAll] = useState(false);
    
  const visibleItems = showAll ? cart : cart.slice(0, INITIAL_VISIBLE);
  const hasMore = cart.length > INITIAL_VISIBLE;

  return (
    loadingCart 
      ? <CartSkeleton /> 
      : cart.length === 0 
        ? (
            <div className="text-center py-20">
                <h2 className="text-2xl md:text-3xl font-bold text-[#5B3A21] dark:text-[#F5EBE6]">
                  {t("cart.emptyCart.title")}
                </h2>
                <p className="mt-3 text-gray-600 dark:text-[#e5ded8] md:text-lg">
                  {t("cart.emptyCart.Desc")}
                </p>
                <div className="mt-7">
                  <Button title={t("cart.emptyCart.button")} link="products" />
                </div>
            </div>
          )
      :  (
          <div className="grid grid-cols-1 xs:grid-cols-[80px_1fr_auto] sm:grid-cols-[96px_1fr_auto] gap-[18px] p-5 border-b border-[var(--color-divider)] items-center">
            {visibleItems.map((ele, index) => (
              <div key={index} className="flex flex-col items-center gap-3 xs:contents max-sm:bg-[var(--color-sand)] px-2.5 py-3 rounded-2xl">
                  <Link href={`/products/${ele?._id}`} className="relative w-[180px] h-[120px] xs:w-full xs:h-full rounded-2xl overflow-hidden">
                    <Image 
                      src={getImageUrl(ele.mainImage)}
                      alt={ele?.title?.[locale] || "somthing error"}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <div>
                    <div className="text-xs text-[var(--color-muted)]">{ele?.brand?.name?.[locale]}</div>
                    <div className="text-[15px] font-semibold my-[5px] leading-[1.5]">{ele?.title?.[locale]}</div>
                    <div className="flex items-center gap-1.5 mt-3 text-[13px]">
                      <ShowCard showCard={false} product={ele} />
                      <ProductsWishlistIcon product={ele} />
                    </div>
                  </div>

                  <div className="text-end flex flex-col items-end gap-[14px]">
                    <div className="text-[17px] font-bold text-green-dark whitespace-nowrap">{ele?.price.toFixed(2)} <span className="text-xs">ر.س </span></div>
                    
                    <div className="flex items-center border border-[var(--color-field)] rounded-[10px] overflow-hidden">
                      <div className="px-[13px] py-[7px] cursor-pointer text-[var(--color-soft-2)] hover:bg-[var(--color-surface)]">−</div>
                      <span className="px-[14px] py-[7px] text-sm min-w-[40px] text-center border-x border-[var(--color-field)]">{ele?.stock}</span>
                      <div className="px-[13px] py-[7px] cursor-pointer text-[var(--color-soft-2)] hover:bg-[var(--color-surface)]">+</div>
                    </div>
                  </div>
              </div>
            ))}
            {hasMore && (
                <button
                    onClick={() => setShowAll((prev) => !prev)}
                    className="mt-5 text-sm font-semibold text-[var(--color-green)] dark:text-[var(--color-gold)] underline cursor-pointer"
                >
                    {showAll ? "Show less" : `Show ${cart.length - INITIAL_VISIBLE} more`}
                </button>
            )}
          </div>
        )
  )
}
