"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getActiveSeasons, getSeasonProducts } from "@/helper/fetchApi";
import { Link } from "@/lib/i18n/routing";
import { getImageUrl } from "@/helper/getImage";
import { NewArrivalsBannerSkeleton } from "./NewArrivalsBannerSkeleton";

const SEASONS_PER_PAGE = 1;
const SEASON_PRODUCTS_LIMIT = 3;

export default function NewArrivalsBanner() {
  const t = useTranslations("home.NewArrivalsBanner");
  const locale = useLocale();

  const [page, setPage] = useState(1);
  const [season, setSeason] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSeason() {
      setLoading(true);

      try {
        const result = await getActiveSeasons(page, SEASONS_PER_PAGE);
        if (cancelled) return;

        setTotalPages(result.totalPages);

        if (!result.season) {
          setSeason(null);
          setProducts([]);
          return;
        }

        const seasonProducts = await getSeasonProducts(result.season._id, SEASON_PRODUCTS_LIMIT);
        if (cancelled) return;

        setSeason(result.season);
        setProducts(seasonProducts);
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to load season:", error);
          setSeason(null);
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSeason();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const goToPrevious = () => setPage((c) => Math.max(1, c - 1));
  const goToNext = () => setPage((c) => Math.min(totalPages, c + 1));

  if (!loading && (!season || products.length === 0)) return null;

  const isInitialLoad = loading && totalPages === 0;

  const seasonName = season?.name?.[locale];
  const seasonDescription = season?.description?.[locale] ?? t("Desc") ?? "";

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-14" aria-busy={loading}>
      <div className="rounded-[22px] overflow-hidden min-[480px]:px-6 bg-[var(--color-sand)] grid grid-cols-1 lg:grid-cols-2 items-center min-h-[260px]">
        {loading ? (
          <NewArrivalsBannerSkeleton count={SEASON_PRODUCTS_LIMIT} label={t("loading")} />
        ) : (
          <>
            <div className="p-2 min-[480px]:p-8 md:p-11">
              <div className="text-[var(--color-muted)] text-[13px] tracking-[.1em] mb-3">
                {t("title")}
              </div>

              <h2 className="font-bold text-[32px] mb-[14px] text-[var(--color-green-dark)] dark:text-[var(--color-gold)] leading-[1.4]">
                {seasonName || t("secondTitle")}
              </h2>

              <p className="text-[var(--color-soft-2)] text-[15px] leading-[1.85] m-0 mb-6 max-w-[380px]">
                {seasonDescription}
              </p>

              <Link
                href="/products#products"
                className="inline-block bg-[var(--color-green)] text-white px-[30px] py-[13px] rounded-[11px] text-[14.5px] cursor-pointer hover:bg-[var(--color-green-dark)]"
              >
                {t("button")}
              </Link>
            </div>

            <div className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-3 gap-3 p-6">
              {products.map((product, index) => {
                const productId = product._id;
                const title = product.title?.[locale] ?? "";
                const price = Number(product.price ?? 0);
                const originalPrice = Number(product.price ?? 0);
                const hasDiscount = price < originalPrice;

                return (
                  <div
                    key={productId ?? index}
                    className="bg-white dark:bg-[var(--color-muted)] rounded-[14px] p-3"
                  >
                    <div className="relative group h-[120px] mb-5">
                      <Link href={`/products/${productId}`}>
                        <Image
                          src={getImageUrl(product.mainImage)}
                          alt={title || "Product"}
                          fill
                          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 33vw, 200px"
                          className="cursor-pointer object-cover bg-black/20 dark:bg-black/40 rounded-xl group-hover:scale-95 transition duration-300"
                        />
                      </Link>
                    </div>

                    <div className="text-[12.5px] font-semibold leading-[1.5] line-clamp-2 min-h-[38px]">
                      {title}
                    </div>

                    <div className="text-[13px] font-bold text-[var(--color-green)] dark:text-white">
                      {price.toFixed(2)} ر.س
                    </div>

                    {hasDiscount && (
                      <div className="text-xs text-[var(--color-muted-3)] line-through">
                        {originalPrice.toFixed(2)} ر.س
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
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
            aria-label={t("previousSeason")}
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
                  aria-label={t("goToSeasonPage", { page: pageNumber })}
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
            aria-label={t("nextSeason")}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] transition hover:bg-[var(--color-green)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {locale === "ar" ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
      )}
    </section>
  );
}