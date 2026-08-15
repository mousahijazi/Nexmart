import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/lib/i18n/routing";

export default function SidePromotions() {
    const t = useTranslations();
    const locale = useLocale();

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="grid max-md:grid-cols-1 max-lg:grid-cols-2 lg:grid-rows-2 gap-4">
        <div className="rounded-[22px] bg-[var(--color-sand)] p-5 min-[480px]:p-7 relative overflow-hidden flex flex-col justify-between max-[480px]:gap-5">
            <div>
                <h1 className="text-xs text-[var(--color-muted)] dark:text-[var(--color-green-light)] tracking-[.1em]">{t("home.hero.SidePromotions.cardOun.title")}</h1>
                <p className="text-[26px] font-bold text-[var(--color-green-light)] dark:text-[var(--color-soft)] mt-2 leading-[1.4]">{t("home.hero.SidePromotions.cardOun.Desc")}</p>
            </div>
            <div className="flex items-end justify-between">
                <Link href="/">
                    <div className="text-[var(--color-green-light)] font-semibold text-sm">{t("home.hero.SidePromotions.cardOun.button")}</div>
                </Link>
            </div>
        </div>

        <div className="rounded-[22px] bg-[var(--color-green-deep)] dark:bg-[var(--color-green-dark)] text-white p-5 min-[480px]:p-7 flex flex-col justify-between max-[480px]:gap-5">
            <div>
                <h1 className="text-xs font-semibold text-[var(--color-gold)] tracking-[.1em]">{t("home.hero.SidePromotions.cardTwo.title")}</h1>
                <p className="md:max-w-[170px] lg:max-w-[200px] text-[26px] font-bold my-2 leading-[1.4] dark:text-[var(--color-soft)]">{t("home.hero.SidePromotions.cardTwo.Desc")}</p>
            </div>
            <Link href="/">
                <div className="text-[var(--color-gold)] font-semibold text-sm">{t("home.hero.SidePromotions.cardTwo.button")}</div>
            </Link>
        </div>
    </div>
  )
}
