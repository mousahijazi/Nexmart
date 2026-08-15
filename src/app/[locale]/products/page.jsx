import { ProductsPage, CategoriesSlider } from "@/index";
import { getCategories } from "@/helper/fetchApi";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Nexmart - shop",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default async function page() {
  const categories = await getCategories();
  const t = await getTranslations();

  return (
    <div>
      <section className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-12 flex flex-col gap-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">
              {t("home.categories.title")}
            </h2>
            <p className="max-w-md mt-2 text-[var(--color-muted)] text-sm">
              {t("home.categories.text")}
            </p>
          </div>

          <CategoriesSlider categories={categories} />
        </div>
      </section>
      <ProductsPage />
    </div>
  )
}
