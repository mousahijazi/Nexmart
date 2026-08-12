import { Button } from "@/index";
import { useTranslations } from "next-intl";

export default function HeroText() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 lg:gap-8 max-w-2xl"> 
        <h1 className="text-center pb-2 pt-1 bg-gradient-to-b from-[#83542F] to-[#C28B4D] bg-clip-text text-transparent md:drop-shadow-[0_3px_3px_rgba(0,0,0,0.45)] text-3xl min-[360px]:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight">
          {t("home.hero.title")}
        </h1>
        <p className="mt-2 text-center text-[#5C4533] dark:text-[#E2D6C8] font-bold text-base sm:text-xl leading-relaxed max-w-lg drop-shadow-xs">
          {t("home.hero.text")}
        </p>
        <Button title={t("home.hero.button")} link="products" />
    </div>
  )
}