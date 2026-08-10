import { Card, Button } from "@/index";
import { useTranslations } from "next-intl";

export default function WhySection() {
  const t = useTranslations();

  return (
    <div className="py-20 sm:py-24 lg:py-36 px-3 sm:px-6 md:px-12 bg-[#e3dfd7] dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-[#5B3A21] dark:text-[#F5EBE6]">
          {t("home.whyNexmart.title")} Nexmart?
        </h2>
        <p className="text-gray-600 dark:text-[#e5ded8] mt-3">
          {t("home.whyNexmart.text")}
        </p>
        <Card />
        <div className="mt-5">
          <Button title={t("home.whyNexmart.button")} link="about" />
        </div>
      </div>
    </div>
  );
}