import { useTranslations } from "next-intl"

export default function TextCart() {
    const t = useTranslations();

  return (
    <div className="mb-16 pb-4 border-b border-[#5B3A21]/10 dark:border-b-2 dark:border-[#A68A64] flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
            <span className="text-xs font-bold tracking-widest text-[#5B3A21]/80 dark:text-[#A68A64] uppercase mb-1 ">
                {t("cart.title")}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#5B3A21] dark:text-[#F5EBE6] tracking-tight">
                {t("cart.title")}
            </h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-[#e5ded8] md:max-w-3/5 md:text-right">
            {t("cart.Desc")}
        </p>
    </div>
  )
}
