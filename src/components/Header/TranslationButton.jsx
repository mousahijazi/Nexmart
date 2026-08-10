"use client"
import { useLocale, useTranslations} from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { Languages } from "lucide-react";

export default function TranslationButton() {
    const t = useTranslations();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const nextLocale = locale === "en" ? "ar" : "en";

    const toggleLanguage = () => {
        startTransition(() => {
            router.replace(pathname, { locale: nextLocale, scroll: false });
        });
    };

  return (
    <button
        type="button"
        disabled={isPending}
        onClick={toggleLanguage}
        className="cursor-pointer dark:text-[#A68A64]"
        aria-label={`Switch to ${nextLocale}`}
    >
        <Languages size={22} />
    </button>
  )
}
