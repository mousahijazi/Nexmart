import { useTranslations } from "next-intl"

export default function ProductsText({total}) {
    const t = useTranslations();

  return (
    <div className="pb-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-3xl sm:text-5xl font-bold text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">
                {t("shop.products.title")}
            </h1>
            <div className="mt-4 text-[var(--color-muted)] flex flex-col">
                <span>
                    {t("shop.products.text")}
                </span>
                <span className="text-[var(--color-green-light)] dark:text-[var(--color-gold-light)] font-semibold">{total} {t("shop.products.availabel")}</span>
            </div>
        </div>
    </div>
  )
}
