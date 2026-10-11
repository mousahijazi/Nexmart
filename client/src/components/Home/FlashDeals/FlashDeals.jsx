"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getActiveOffers, getOfferProducts } from "@/helper/fetchApi";
import { Link } from "@/lib/i18n/routing";
import { getImageUrl } from "@/helper/getImage";
import { DealCountdown } from "@/index";
import { FlashDealsSkeleton } from "./FlashDealsSkeleton";

const OFFERS_PER_PAGE = 1;
const CATEGORY_PRODUCTS_LIMIT = 4;

export default function FlashDeals() {
  const t = useTranslations("home.deal");
  const locale = useLocale();
  const [page, setPage] = useState(1);
  const [offer, setOffer] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadOffer() {
      setLoading(true);
      setError(false);

      try {
        const result = await getActiveOffers(page, OFFERS_PER_PAGE);
        if (cancelled) return;

        setTotalPages(result.totalPages);

        if (!result.offer) {
          setOffer(null);
          setProducts([]);
          return;
        }

        const limit = result.offer.targetType === "product" ? 1 : CATEGORY_PRODUCTS_LIMIT;
        const offerProducts = await getOfferProducts(result.offer, limit);
        if (cancelled) return;

        setOffer(result.offer);
        setProducts(offerProducts);
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load Flash Deals:", err);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadOffer();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const goToPrevious = () => setPage((c) => Math.max(1, c - 1));
  const goToNext = () => setPage((c) => Math.min(totalPages, c + 1));

  if (error) return null;
  if (!loading && (!offer || products.length === 0 || totalPages === 0)) return null;

  const isInitialLoad = loading && totalPages === 0;
  const isProductOffer = offer?.targetType === "product";

  return (
    <section id="FlashDeals" className="max-w-[1280px] mx-auto px-6 py-14" aria-busy={loading}>
      <div className="rounded-[22px] bg-[var(--color-green-deep)] dark:bg-[var(--color-sand)] text-white p-5 md:p-[34px] grid grid-cols-1 gap-[34px] items-center xl:grid-cols-[minmax(280px,360px)_minmax(0,1fr)]">
        {loading ? (
          <FlashDealsSkeleton isProductOffer={isProductOffer} label={t("loading")} />
        ) : (
          <>
            <div>
              <div className="text-[var(--color-gold)] font-semibold text-[13px] tracking-[.12em] mb-[10px]">
                {t("title")}
              </div>

              <h2 className="text-[30px] font-bold mb-[10px] leading-[1.4]">
                {offer.name[locale]}
              </h2>

              {offer?.description?.[locale] && (
                <p className="text-[#A7BBB2] text-sm leading-[1.8] mb-[22px]">
                  {offer.description[locale]}
                </p>
              )}

              <DealCountdown endDate={offer.endDate} />
            </div>

            {isProductOffer ? (
              <div className="max-w-[560px] w-full mx-auto">
                {products.map((product) => (
                  <ProductOfferCard key={product._id} product={product} locale={locale} offer={offer} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4 gap-[14px]">
                {products.map((product) => (
                  <CategoryOfferCard key={product._id} product={product} locale={locale} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {isInitialLoad && <div className="mt-6 h-11" aria-hidden="true" />}

      {!isInitialLoad && totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={goToPrevious}
            disabled={loading || page <= 1}
            aria-label={t("previousOffer")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] transition hover:bg-[var(--color-green)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {locale === "ar" ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2" aria-live="polite">
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              const isCurrent = pageNumber === page;
              return (
                <button
                  key={pageNumber}
                  type="button"
                  disabled={loading}
                  onClick={() => setPage(pageNumber)}
                  aria-label={t("goToOfferPage", { page: pageNumber })}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? "w-7 bg-[var(--color-green)] dark:bg-[var(--color-gold)]"
                      : "w-2.5 bg-[var(--color-field)] hover:bg-[var(--color-muted-3)]"
                  }`}
                />
              );
            })}
          </div>

          <button
            type="button"
            onClick={goToNext}
            disabled={loading || page >= totalPages}
            aria-label={t("nextOffer")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] transition hover:bg-[var(--color-green)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {locale === "ar" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
      )}
    </section>
  );
}

function CategoryOfferCard({ product, locale }) {
  const title = product.title[locale];
  const originalPrice = Number(product.price ?? 0);
  const finalPrice = Number(product.finalPrice ?? product.discountPrice ?? originalPrice);

  const discountAmount = Math.max(0, originalPrice - finalPrice);
  const discountPercentage = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;
  const image = product.mainImage;

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="bg-white dark:bg-[var(--color-muted)] rounded-2xl p-[14px] text-[var(--color-ink)]">
      <div className="relative group h-[120px]">
        <Link href={`/products/${product._id}`}>
          <Image
            src={getImageUrl(image)}
            alt={title}
            fill
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 25vw"
            className="cursor-pointer object-cover bg-black/20 dark:bg-black/40 rounded-xl group-hover:scale-95 transition duration-300"
          />
        </Link>

        {discountAmount > 0 && (
          <div className="absolute top-2 start-2 bg-[var(--color-red)] text-white text-[11px] font-bold rounded-[7px] px-2 py-[3px]">
            -{discountPercentage}%
          </div>
        )}
      </div>

      <div className="text-[13.5px] font-semibold my-[11px] leading-[1.5] line-clamp-2 min-h-[41px]">
        {title}
      </div>

      <ProductPrices originalPrice={originalPrice} finalPrice={finalPrice} />
    </div>
  );
}

function ProductOfferCard({ product, locale, offer }) {
  const title = product.title[locale];
  const description = product.description[locale];
  const image = product.mainImage;

  const originalPrice = Number(product.price ?? 0);
  const finalPrice = Number(product.finalPrice ?? product.discountPrice ?? originalPrice);
  const discountAmount = Math.max(0, originalPrice - finalPrice);
  const discountPercentage = originalPrice > 0 ? Math.round((discountAmount / originalPrice) * 100) : 0;

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="grid grid-cols-1 sm:grid-cols-2 gap-5 rounded-2xl bg-white dark:bg-[var(--color-muted)] p-4 md:p-5 text-[var(--color-ink)]">
      <Link href={`/products/${product._id}`} className="relative block min-h-[220px] sm:min-h-[280px] overflow-hidden rounded-xl bg-black/5">
        <Image
          src={getImageUrl(image)}
          alt={title}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 280px"
          className="object-cover transition duration-300 hover:scale-105"
        />

        {discountAmount > 0 && (
          <div className="absolute top-3 start-3 bg-[var(--color-red)] text-white text-sm font-bold rounded-lg px-3 py-2">
            -{discountPercentage}%
          </div>
        )}
      </Link>

      <div className="flex flex-col justify-center py-2">
        <div className="text-xs font-semibold text-[var(--color-green)] dark:text-[var(--color-gold)] mb-2">
          {offer.name[locale]}
        </div>

        <h3 className="text-xl md:text-2xl font-bold leading-relaxed">
          {title}
        </h3>

        {description && (
          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)] line-clamp-3">
            {description}
          </p>
        )}

        <div className="mt-5">
          <ProductPrices originalPrice={originalPrice} finalPrice={finalPrice} />
        </div>

        <Link href={`/products/${product._id}`} className="mt-5 inline-flex w-fit items-center justify-center rounded-xl bg-[var(--color-green)] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 dark:bg-[var(--color-gold)] dark:text-[var(--color-green-deep)]">
          {locale === "ar" ? "عرض المنتج" : "View product"}
        </Link>
      </div>
    </div>
  );
}

function ProductPrices({ originalPrice, finalPrice }) {
  const hasDiscount = finalPrice < originalPrice;

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="font-bold text-[var(--color-green)] dark:text-white">
        {finalPrice.toFixed(2)}{" "}
        <span className="text-xs">ر.س</span>
      </span>

      {hasDiscount && (
        <span className="text-xs text-[var(--color-muted-3)] line-through">
          {originalPrice.toFixed(2)}{" "}
          <span className="text-xs">ر.س</span>
        </span>
      )}
    </div>
  );
}