import { Button } from "@/index";
import { useTranslations, useLocale } from "next-intl";

export default function SaleSeason() {
    const t = useTranslations();
    const locale = useLocale();

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="relative rounded-[22px] overflow-hidden sm:bg-[linear-gradient(115deg,#0B3B2E_0%,#0E4D3A_55%,#12604A_100%)] text-white min-h-[420px] flex items-center p-2 sm:p-8 md:p-[52px]">
        <div className="hidden sm:block absolute inset-0 opacity-[.16] bg-[repeating-linear-gradient(135deg,#D4A94A_0_1px,transparent_1px_18px)]"></div>
        <div className="hidden sm:block absolute -left-[60px] -bottom-20 w-[340px] h-[340px] rounded-full border border-[var(--color-gold)]/35"></div>
        
        <div className="relative max-w-[520px]">
            <div className="inline-flex items-center gap-2 text-[#E9C876] rounded-full min-sm:px-[14px] py-[6px] text-[13px] mb-[22px]">{t("home.hero.title")}</div>
            <h1 className="max-[480px]:max-w-2xl font-extrabold text-3xl sm:text-4xl md:text-[52px] leading-[1.25] mb-4 max-sm:text-[var(--color-green)] dark:text-[var(--color-soft)]">{t("home.hero.secondTitle")}</h1>
            <p className="text-[17px] leading-[1.8] text-gray-600 min-sm:text-[#C6D6CF] mb-[30px] max-w-[420px]">{t("home.hero.Desc")}</p>
            <div className="flex items-center gap-3 flex-wrap">
                <Button title={t("element.button")} link="products" />
                <div className="cursor-pointer rounded-xl border border-gray-600 min-sm:border-white/28 text-gray-600 min-sm:text-white px-7 py-[15px] text-[15px] hover:bg-gray-600/10 min-sm:hover:bg-white/8">{t("home.hero.button")}</div>
            </div>
            <div className="flex items-end gap-[34px] mt-[38px] pt-[26px] border-t border-white/14 flex-wrap">
                <div><div className="text-2xl font-bold text-[var(--color-gold)]">{t("home.hero.data.products.value")}</div><div className="text-[13px] text-gray-600 max-sm:dark:text-[#A7BBB2] min-sm:text-[#A7BBB2]">{t("home.hero.data.products.label")}</div></div>
                <div><div className="text-2xl font-bold text-[var(--color-gold)]">{t("home.hero.data.customer.value")}</div><div className="text-[13px] text-gray-600 max-sm:dark:text-[#A7BBB2] min-sm:text-[#A7BBB2]">{t("home.hero.data.customer.label")}</div></div>
                <div><div className="text-2xl font-bold text-[var(--color-gold)]">{t("home.hero.data.rating.value")}</div><div className="text-[13px] text-gray-600 max-sm:dark:text-[#A7BBB2] min-sm:text-[#A7BBB2]">{t("home.hero.data.rating.label")}</div></div>
            </div>
        </div>
    </div>
  )
}
