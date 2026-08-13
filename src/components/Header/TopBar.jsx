import { useTranslations } from "next-intl";
import { TranslationButton, ButtonTheme } from "@/index";
import { Link } from "@/lib/i18n/routing";

export default function TopBar() {
    const t = useTranslations();

  return (
    <div className="bg-[var(--color-green-dark)] text-[#E8EDE9] dark:text-[#f9f4f4] text-[13px] py-3">
        <div className="max-w-[1280px] mx-auto px-6 py-[9px] flex-wrap flex max-[480px]:flex-col min-[480px]:items-center justify-between gap-4">
            <div className="flex items-center gap-[18px]">
                <span className="flex items-center gap-[7px]"><span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)] inline-block"></span>{t("header.TopBar.linkTitle")}</span>
            </div>
            <div className="flex max-[480px]:flex-col min-[480px]:items-center gap-4 text-[#B9C7C0] dark:text-[#f9f4f4]">
                <div className="flex items-center gap-3">
                    <Link href="/" className="hover:text-[var(--color-gold)] transation duration-300"><span>{t("header.TopBar.secondLink")}</span></Link>
                    <Link href="/" className="hover:text-[var(--color-gold)] transation duration-300"><span>{t("header.TopBar.thirdLink")}</span></Link>
                </div>
                <div className="flex items-center gap-3">
                    <ButtonTheme />
                    <TranslationButton />
                </div>
            </div>
        </div>
    </div>
  )
}
