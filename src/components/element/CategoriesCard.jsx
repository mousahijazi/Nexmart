import { Link } from "@/lib/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { getLocalizedField } from "@/lib/locale";
import Image from "next/image";

export default function CategoriesCard({categories}) {
    const t = useTranslations();
    const locale = useLocale();
    
  return (
    <>
        {categories.map((ele, index) => (
            <Link
                key={index}
                href={`/products?category=${ele.slug}#products`}
                className="cursor-pointer"
            >
                <div className="h-full bg-white dark:bg-[var(--color-surface)] border dark:border-none border-[var(--color-border)] shadow-lg hover:shadow-xl rounded-2xl px-[14px] py-5 text-center cursor-pointer transition hover:-translate-y-1 hover:shadow-[0_10px_26px_rgba(11,59,46,.09)] hover:border-[#D4C79A]">
                    <div className="relative h-[74px] overflow-hidden mb-3 rounded-xl">
                        <Image 
                            src={ele.image}
                            alt={ele.name_en}
                            fill
                        />
                    </div>
                    <div className="font-semibold text-sm">{getLocalizedField(ele, "name", locale)}</div>
                    <div className="text-xs text-[var(--color-muted)] mt-[3px]">{t("home.categories.count", {count: ele.count})}</div>
                </div>
            </Link>
        ))}
    </>
  )
}
