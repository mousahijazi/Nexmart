import { useTranslations } from "next-intl";
import { NewsletterForm } from "@/index";

export default function NewsletterBanner() {
    const t = useTranslations("home.NewsletterBanner");

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-14">
        <div
            className="relative overflow-hidden rounded-[22px] text-white p-6 md:p-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            style={{
                background: "linear-gradient(115deg, #0E4D3A, #0B3B2E)",
            }}
        >
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: "repeating-linear-gradient(135deg, rgba(212, 169, 74, 0.14) 0, rgba(212, 169, 74, 0.14) 1px, transparent 1px, transparent 20px)",
                }}
            ></div>
            <div className="relative">
                <h2 className="font-bold text-[28px] mb-3 leading-[1.5]">{t("title")}</h2>
                <p className="text-[#A7BBB2] text-[15px] leading-[1.85] m-0">{t("Desc")}</p>
            </div>
            <NewsletterForm />
        </div>
    </section>
  )
}
