import { Link } from "@/lib/i18n/routing";
import { useTranslations } from "next-intl";

export default function CategoriesCard({categories}) {
    const t = useTranslations();

  return (
    <>
        {categories.map((ele, index) => (
            <Link
                key={index}
                href={`/products?category=${ele.slug}#products`}
                className="cursor-pointer"
            >
                <div className="h-full bg-white dark:bg-[var(--color-surface)] border dark:border-none border-[var(--color-border)] shadow-lg hover:shadow-xl rounded-2xl px-[14px] py-5 text-center cursor-pointer transition hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(11,59,46,.09)] hover:border-[#D4C79A]">
                    <div className="h-[74px] mb-3 rounded-xl bg-[repeating-linear-gradient(45deg,#EDEBE2_0_6px,#F5F3EC_6px_12px)] flex items-center justify-center font-mono text-[9px] text-muted-2">{ele.slug}</div>
                    <div className="font-semibold text-sm">{ele.name}</div>
                    <div className="text-xs text-[var(--color-muted)] mt-[3px]">{t("home.categories.count", {count: ele.count})}</div>
                </div>
            </Link>
        ))}
    </>
  )
}
