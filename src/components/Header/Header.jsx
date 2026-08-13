import { Link } from "@/lib/i18n/routing";
import { HeaderNavItems, TopBar, NavSearch } from "@/index";
import { DATA } from "./data";
import { useTranslations } from "next-intl";

export default function Header() {
  const t = useTranslations();

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-50 bg-[var(--color-cream)] backdrop-blur-md border-b border-border">
        <div className="max-w-[1280px] mx-auto px-6 py-[14px] flex items-center justify-between gap-6 flex-wrap">
          <Link href="/">
            <div className="flex items-center gap-[10px] cursor-pointer shrink-0">
              <div className="w-[38px] h-[38px] rounded-[11px] bg-[linear-gradient(145deg,#0E4D3A,#0B3B2E)] flex items-center justify-center text-[var(--color-gold)] font-extrabold text-[19px]">{t("header.logo")}</div>
              <div className="leading-[1.1]">
                <div className="font-extrabold text-[19px] text-[var(--color-green)]">{t("header.title")}</div>
                <div className="text-[10px] tracking-[.22em] text-[var(--color-muted)]">{t("header.secondtitle")}</div>
              </div>
            </div>
          </Link>

          <div className="hidden md:contents">
            <NavSearch />
          </div>

          <HeaderNavItems />
        </div>
        <div className="border-t border-divider">
          <div className="max-w-[1280px] mx-auto px-6 flex items-center gap-[26px] text-sm text-[var(--color-soft)] overflow-x-auto custom-scrollbar">
            {DATA.navCats.map((ele, index) => (
              <Link key={index} className="contents">
                <div className="py-3 whitespace-nowrap cursor-pointer hover:text-[var(--color-gold)] transition duration-300">{ele}</div>
              </Link>
            ))}
            <Link href="/" className="contents">
              <div className="py-3 whitespace-nowrap text-[var(--color-red)] font-semibold ms-auto">{t("header.discountsTitle")}</div>
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
