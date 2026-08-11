import { Heart } from "lucide-react";
import { WishlistDashboardData } from "@/index";
import { useTranslations } from "next-intl";

export default function WishlistDashboard() {
    const t = useTranslations();

  return (
    <div className="min-[480px]:bg-white min-[480px]:dark:bg-[#181512] rounded-2xl min-[480px]:shadow-md dark:shadow-black/60 min-[480px]:p-10 mb-14">
        <div className="flex max-[360px]:flex-col items-start min-[360px]:items-center gap-5">
            <div className="min-w-18 min-h-18 rounded-2xl flex items-center justify-center bg-[#5B3A21] text-white">
                <Heart size={34} fill="currentColor" />
            </div>
            <div>
                <h1 className="text-2xl sm:text-4xl font-bold text-[#5B3A21] dark:text-[#F5EBE6]">
                    {t("wishlist.wishListDashboard.title")}
                </h1>
                <p className="mt-2 text-gray-500 dark:text-[#D4C7BC]">
                    {t("wishlist.wishListDashboard.Desc")}
                </p>
            </div>
        </div>
        <WishlistDashboardData />
    </div>
  )
}
