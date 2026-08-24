import { getActiveOffer, getOfferProducts } from "@/helper/fetchApi";
import { DealCountdown } from "@/index";
import { getLocalizedField } from "@/lib/locale";
import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/lib/i18n/routing";

export default async function FlashDeals() {
    const offer = await getActiveOffer();
    if (!offer) return null;

    const products = await getOfferProducts(offer, 4);
    if (products.length === 0) return null;

    const t = await getTranslations("home.deal");
    const locale = await getLocale();

  return (
    <section id="FlashDeals" className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="rounded-[22px] bg-[var(--color-green-deep)] dark:bg-[var(--color-sand)] text-white p-5 md:p-[34px] grid grid-cols-1 xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)] gap-[34px] items-center">
        <div>
            <div className="text-[var(--color-gold)] font-semibold text-[13px] tracking-[.12em] mb-[10px]">{t("title")}</div>
            <h2 className="text-[30px] font-bold mb-[10px] leading-[1.4]">{getLocalizedField(offer, "title", locale)}</h2>
            <p className="text-[#A7BBB2] text-sm leading-[1.8] mb-[22px]">{t("Desc")}</p>
            <DealCountdown endDate={offer.endDate} />
        </div>
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4 gap-[14px]">
            {products.map((product, index) => {
                const originalPrice = product.price;
                const finalPrice = product.discountPrice;
                const discountPercentage = Math.round(
                    ((originalPrice - finalPrice) / originalPrice) * 100
                );

                return(
                    <div key={index} dir="rtl" className="bg-white dark:bg-[var(--color-muted)] rounded-2xl p-[14px] text-[var(--color-ink)]">
                        <div className="relative group h-[120px]">
                            <Link href={`/products/${product.id}`}>
                                <Image
                                    src={product.image}
                                    alt={getLocalizedField(product, "title", locale)}
                                    fill
                                    priority
                                    className="cursor-pointer object-cover bg-black/20 dark:bg-black/40 rounded-xl group-hover:bg-black/10 group-hover:scale-95 transition duration-300"
                                />
                            </Link>
                            <div className="absolute top-2 start-2 bg-[var(--color-red)] text-white text-[11px] font-bold rounded-[7px] px-2 py-[3px]">-{discountPercentage}٪</div>
                        </div>
                        <div className="text-[13.5px] font-semibold my-[11px] leading-[1.5] line-clamp-2 min-h-[41px]">{getLocalizedField(product, "title", locale)}</div>
                        <div className="flex flex-wrap items-baseline gap-2">
                            <span className="font-bold text-[var(--color-green)] dark:text-white">{finalPrice.toFixed(2)} <span className="text-xs">ر.س</span></span>
                            <span className="text-xs text-[var(--color-muted-3)] line-through">{originalPrice.toFixed(2)} <span className="text-xs">ر.س</span></span>
                        </div>
                    </div>
                )
            })}
        </div>
        </div>
    </section>
  )
}
