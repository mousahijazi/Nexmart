import { Link } from "@/lib/i18n/routing";
import { HeartCrack } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EmptyWishlist() {
  const t = useTranslations();

  return (
    <div className="min-[480px]:bg-white min-[480px]:dark:bg-[#18221f] rounded-2xl min-[480px]:shadow-lg dark:shadow-none border border-transparent min-[480px]:dark:border-[#22332e] max-[480px]:py-20 min-[480px]:p-20 text-center transition duration-300">
      <div className="w-24 h-24 mx-auto rounded-full bg-black/5 dark:bg-[#121a17] flex items-center justify-center border border-transparent dark:border-[#22332e]">
        <HeartCrack size={42} className="text-[var(--color-green-dark)] dark:text-[var(--color-gold)]" />
      </div>

      <h2 className="min-[480px]:mt-8 text-3xl font-bold text-[var(--color-green-dark)] dark:text-gray-100">
        {t("wishlist.emptyWishlist.title")}
      </h2>

      <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm md:text-base leading-relaxed">
        {t("wishlist.emptyWishlist.Desc")}
      </p>

      <Link
        href="/products"
        className="
          inline-block
          mt-8
          px-8
          py-3
          rounded-xl
          bg-[var(--color-green-dark)]
          dark:bg-[#0f2e25]
          text-white
          font-semibold
          hover:opacity-90
          dark:hover:bg-[#153e32]
          border border-transparent
          dark:border-[#22332e]
          shadow-md
          transition duration-300
        "
      >
        {t("wishlist.emptyWishlist.button")}
      </Link>
    </div>
  );
}