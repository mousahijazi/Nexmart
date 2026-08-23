import { getTranslations, getLocale } from "next-intl/server";
import { getBrand } from "@/helper/fetchApi";
import { getLocalizedField } from "@/lib/locale";

export default async function Brand() {
    const t = await getTranslations("home.Brand");
    const locale = await getLocale();
    const brands = await getBrand(6);

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="text-center mb-[22px]">
            <h2 className="font-bold text-2xl text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">{t("title")}</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-[14px]">
            {brands.map((ele, index) => (
                <div key={index} className="flex-1 min-w-[140px] max-w-[180px] h-[82px] bg-white dark:bg-[var(--color-green-dark)] shadow-lg hover:shadow-xl transition-all duration-300 border dark:border-none border-[var(--color-border)] rounded-[14px] flex items-center justify-center font-mono text-[10px] text-[var(--color-muted-2)] tracking-[.08em]">{getLocalizedField(ele, "name", locale)}</div>
            ))}
        </div>
    </section>
  )
}
