"use client";

import { ProductStars } from "@/index";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getImageUrl } from "@/helper/getImage";

export default function ProductsReviews({ reviews = [], loading, error, currentUser, userAlreadyReviewed, rating, setRating, comment, setComment, onSubmit, submitError, submitting }) {
  const t = useTranslations();

  return (
    <div className="mt-14 w-full px-4 sm:px-6">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="h-8 w-1 rounded-full bg-[var(--color-gold)]" />

            <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-[var(--color-green-dark)] dark:text-[var(--color-ink)] sm:text-[28px]">
              {t("shop.products.reviews.title")}
            </h1>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center">
            <p className="text-[13px] font-semibold text-[var(--color-muted)]">
              Loading reviews...
            </p>
          </div>
        ) : error ? (
          <div className="mt-8 rounded-[22px] border border-[var(--color-red)]/20 bg-[var(--color-surface)] px-6 py-14 text-center">
            <p className="text-[13px] font-semibold text-[var(--color-red)]">
              {error}
            </p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="relative mt-8 overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-12 text-center sm:px-10">
            <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full border border-[var(--color-gold)]/15" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full border border-[var(--color-green-light)]/10" />

            <div className="relative">
              <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-sand)] text-[var(--color-gold)]">
                <span className="text-[22px]">★</span>
              </div>

              <h2 className="text-[19px] font-bold text-[var(--color-green-dark)] dark:text-[var(--color-ink)]">
                Be the first to review this product!
              </h2>

              <p className="mx-auto mt-2 max-w-[420px] text-[13px] leading-6 text-[var(--color-muted)]">
                Share your experience with other customers.
              </p>
            </div>
          </div>
        ) : (
          <div
            dir="ltr"
            className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3"
          >
            {reviews.map((review) => (
              <div
                key={review._id}
                className="group flex min-h-[230px] flex-col justify-between rounded-[20px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition duration-300 hover:-translate-y-1 hover:border-[var(--color-gold)]/45"
              >
                <div>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <ProductStars rating={review.rating} />

                    <span className="rounded-full bg-[var(--color-sand)] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-muted)]">
                      Review
                    </span>
                  </div>

                  <h2 className="text-[15px] font-semibold leading-7 text-[var(--color-ink)]">
                    {review.comment}
                  </h2>
                </div>

                <div className="mt-8 flex items-center gap-3 border-t border-[var(--color-divider)] pt-4">
                  <Image
                    src={getImageUrl(review.user?.avatar) || "/Profile.jpg"}
                    alt={
                      review.user
                        ? `${review.user.firstName} ${review.user.lastName}`
                        : "User"
                    }
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-[var(--color-cream)]"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-bold text-[var(--color-green-dark)] dark:text-[var(--color-ink)]">
                      {review.user
                        ? `${review.user.firstName} ${review.user.lastName}`
                        : "User"}
                    </p>

                    <p className="mt-0.5 text-[10px] font-medium text-[var(--color-muted)]">
                      Verified customer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && currentUser && !userAlreadyReviewed && (
          <form
            onSubmit={onSubmit}
            className="relative mt-12 overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-7"
          >
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-[var(--color-gold)]/10" />

            <div className="relative">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-6 w-1 rounded-full bg-[var(--color-gold)]" />

                    <h2 className="text-[19px] font-extrabold text-[var(--color-green-dark)] dark:text-[var(--color-ink)]">
                      {t("shop.products.reviews.addReview")}
                    </h2>
                  </div>

                  <p className="mt-1 pl-3 text-[11px] text-[var(--color-muted)]">
                    {t("shop.products.reviews.rating")}
                  </p>
                </div>

                <div className="flex items-center gap-1 rounded-full bg-[var(--color-sand)] px-3 py-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-[25px] leading-none transition ${
                        star <= rating
                          ? "text-[var(--color-gold)]"
                          : "text-[var(--color-field)]"
                      }`}
                      aria-label={`Rate ${star} out of 5`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder={t("shop.products.reviews.placeholder")}
                  rows={4}
                  className="w-full resize-none rounded-[15px] border border-[var(--color-border)] bg-[var(--color-cream)] px-4 py-3.5 text-[13px] leading-6 text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-gold)] focus:ring-1 focus:ring-[var(--color-gold)]"
                />
              </div>

              {submitError && (
                <p className="mt-3 rounded-xl bg-[var(--color-red)]/8 px-3 py-2 text-[12px] font-semibold text-[var(--color-red)]">
                  {submitError}
                </p>
              )}

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-[12px] bg-[var(--color-green-dark)] px-6 py-3 text-[12px] font-bold text-[var(--color-cream)] transition hover:bg-[var(--color-green)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? t("shop.products.reviews.sending") : t("shop.products.reviews.submit")}
                </button>
              </div>
            </div>
          </form>
        )}

        {!loading && !error && currentUser && userAlreadyReviewed && (
          <div className="mt-8 rounded-[18px] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 text-center">
            <p className="text-[12px] font-semibold text-[var(--color-muted)]">
              {t("shop.products.reviews.alreadyReviewed")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
