"use client"
import { useLocale} from "next-intl";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { Languages } from "lucide-react";

export default function TranslationButton() {
    const locale = useLocale();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();
    const nextLocale = locale === "en" ? "ar" : "en";

    const toggleLanguage = () => {
        const currentParams = searchParams.toString();
        const targetUrl = currentParams ? `${pathname}?${currentParams}` : pathname;

        startTransition(() => {
            router.replace(targetUrl, { locale: nextLocale, scroll: false });
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
