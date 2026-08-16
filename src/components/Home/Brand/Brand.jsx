import { useTranslations } from "next-intl"

export default function Brand() {
    const t = useTranslations("home.Brand");
    const brands = ["BRAND 01", "BRAND 02", "BRAND 03", "BRAND 04", "BRAND 05", "BRAND 06"];

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="text-center mb-[22px]">
            <h2 className="font-bold text-2xl text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">{t("title")}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-[14px]">
            {brands.map((ele, index) => (
                <div key={index} className="bg-white dark:bg-[var(--color-green-dark)] shadow-lg hover:shadow-xl transition-all duration-300 border dark:border-none border-[var(--color-border)] rounded-[14px] h-[82px] flex items-center justify-center font-mono text-[10px] text-[var(--color-muted-2)] tracking-[.08em]">{ele}</div>
            ))}
        </div>
    </section>
  )
}
