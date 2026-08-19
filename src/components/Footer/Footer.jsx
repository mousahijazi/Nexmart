import { PayList, FooterColsList } from "@/index";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="bg-[var(--color-green-dark)] text-[#C6D6CF]">
      <div className="max-w-[1280px] mx-auto px-6 pt-[52px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-9">
        <div>
          <div className="flex items-center gap-[10px] mb-4">
            <div className="w-[34px] h-[34px] rounded-[10px] bg-[var(--color-gold)] flex items-center justify-center text-[var(--color-green-dark)] font-extrabold">{t("header.logo")}</div>
            <div className="font-extrabold text-lg text-white">{t("header.title")}</div>
          </div>
          <p className="text-sm leading-[1.9] mb-[18px] max-w-[300px]">{t("footer.Desc")}</p>
          <div className="text-[12.5px] text-[#8FA79D]">{t("footer.contact")}</div>
        </div>
        <div className="contents">
          <FooterColsList />
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 mt-[34px]">
        <div className="border-t border-[#1D5142] py-[22px] flex items-center justify-between gap-5 flex-wrap">
          <div className="text-[13px] text-[#8FA79D]">{t("footer.reserved")}</div>
          <PayList />
        </div>
      </div>
    </footer>
  )
}
