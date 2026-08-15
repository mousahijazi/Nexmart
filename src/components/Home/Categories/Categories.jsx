import { getCategories } from "@/helper/fetchApi";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/routing";
import { CategoriesCard } from "@/index";

export default async function Categories() {
  const categories = await getCategories();
  const t = await getTranslations();
  const displayedCategories = categories?.slice(0, 6) || [];
  
  return (
    <section className="max-w-[1280px] mx-auto px-6 py-14">
      <div className="flex items-end justify-between mb-[22px] gap-4 flex-wrap">
        <div>
          <h2 className="text-[28px] font-bold text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">{t("home.categories.title")}</h2>
          <p className="mt-2 text-[var(--color-muted)] text-sm">{t("home.categories.text")}</p>
        </div>
        <Link href="/products">
          <div className="text-sm text-[var(--color-green)] dark:text-[var(--color-gold)] font-semibold cursor-pointer whitespace-nowrap">{t("home.categories.button")}</div>
        </Link>
      </div>
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[14px]">
        <CategoriesCard categories={displayedCategories} />
      </div>
    </section>
  )
}
