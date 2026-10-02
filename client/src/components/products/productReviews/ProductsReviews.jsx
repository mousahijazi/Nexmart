"use client";
import { ProductStars } from "@/index";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getImageUrl } from "@/helper/getImage";

export default function ProductsReviews({ reviews = [], loading, error, currentUser, userAlreadyReviewed, rating, setRating, comment, setComment, onSubmit, submitError, submitting }) {
  const t = useTranslations();

  return (
    <div className="mt-16">
      <h1 className="text-2xl text-[var(--color-green-dark)] dark:text-gray-100 font-bold">
        {t("shop.products.reviews.title")}
      </h1>

      {loading ? (
        <div className="mt-10 text-center text-[var(--color-muted)] dark:text-gray-400">
          Loading reviews...
        </div>
      ) : error ? (
        <div className="mt-10 text-center text-red-500">
          {error}
        </div>
      ) : reviews.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-[var(--color-border)] dark:border-[#22332e] bg-white dark:bg-[#18221f] px-6 py-10 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[var(--color-green-dark)] dark:text-gray-100">
            Be the first to review this product!
          </h2>

          <p className="mt-2 text-[var(--color-muted)] dark:text-gray-400">
            Share your experience with other customers.
          </p>
        </div>
      ) : (
        <div dir="ltr" className="mt-10 grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12">
          {reviews.map((review) => (
              <div key={review._id} className="flex flex-col gap-7 bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl pl-3 xl:pr-40 md:pr-32 sm:28 min-[480px]:pr-24 max-[480px]:pr-16 py-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300">
                <div>
                  <ProductStars rating={review.rating} />

                  <h2 className="mb-2 text-lg text-[#12211C] dark:text-gray-100 font-bold">
                    {review.comment}
                  </h2>
                </div>

                <div className="flex flex-row items-center gap-2">
                  <Image
                    src={getImageUrl(review.user?.avatar) || "/Profile.jpg"}
                    alt={review.user ? `${review.user.firstName} ${review.user.lastName}` : "User"}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />

                  <p className="text-sm text-[var(--color-muted)] dark:text-gray-400 font-semibold">
                    {review.user ? `${review.user.firstName} ${review.user.lastName}` : "User"}
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {!loading && !error && currentUser && !userAlreadyReviewed && (
          <form onSubmit={onSubmit} className="mt-16 bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl text-[var(--color-green-dark)] dark:text-gray-100 font-bold">
              {t("shop.products.reviews.addReview")}
            </h2>

            <div className="mt-6">
              <p className="mb-3 text-sm text-[var(--color-muted)] dark:text-gray-400 font-semibold">
                {t("shop.products.reviews.rating")}
              </p>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition ${
                        star <= rating
                          ? "text-[var(--color-gold)]"
                          : "text-gray-300 dark:text-[#2b3d37]"
                      }`}
                      aria-label={`Rate ${star} out of 5`}
                    >
                      ★
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="mt-6">
              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder={t("shop.products.reviews.placeholder")}
                rows={4}
                className="w-full resize-none rounded-xl border border-[var(--color-border)] dark:border-[#22332e] bg-transparent px-4 py-3 text-[#12211C] dark:text-gray-100 outline-none focus:ring-2 focus:ring-[var(--color-gold)]"
              />
            </div>

            {submitError && (
              <p className="mt-3 text-sm text-red-500">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 rounded-xl bg-[var(--color-green-dark)] px-6 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? t("shop.products.reviews.sending") : t("shop.products.reviews.submit")}
            </button>
          </form>
        )}

      {!loading && !error && currentUser && userAlreadyReviewed && (
          <div className="mt-10 text-center text-[var(--color-muted)] dark:text-gray-400 font-semibold">
            {t("shop.products.reviews.alreadyReviewed")}
          </div>
        )}
    </div>
  );
}