import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function NavSearch() {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="flex-1 min-w-[200px] flex items-center gap-[10px] bg-surface border border-[var(--color-field)] rounded-xl px-[14px] py-[10px] focus-within:border-green">
        <span className="text-gray-600 text-[15px]"><Search size={18} /></span>
        <input placeholder={t("header.search.placeholder")} className="border-0 bg-transparent outline-none text-sm w-full text-gray-600 dark:text-[var(--color-ink)]" />
        <span className={`text-xs text-gray-600 ${locale === "ar" ? "border-r pr-3" : "border-l pl-3"} border-[#DCDAD0] whitespace-nowrap cursor-pointer hover:text-[var(--color-gold)] transition duration-300`}>{t("header.search.title")}</span>
    </div>
  )
}
