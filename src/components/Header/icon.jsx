import { Link } from "@/lib/i18n/routing";
import { ButtonTheme, Auth, TranslationButton } from "@/index";
import { ShoppingCart, Heart} from "lucide-react";
import { useProductContext } from "@/Context/CartProvider";
import { useTranslations } from "next-intl";
import { useWishlistContext } from "@/Context/WishlistProvider";

export default function Icon() {
    const t = useTranslations();
    const {cart} = useProductContext();
    const {wishlist} = useWishlistContext();

  return (
    <>
        <div className="flex min-[480px]:justify-center w-full flex-wrap max-[480px]:flex-col gap-3">
            <div className="flex flex-row-reverse px-3.5 justify-center items-center gap-4">
                <Link href="/cart" className="flex items-center gap-1 relative text-gray-600 hover:text-gray-900 dark:text-[#D4C7BC] dark:hover:text-[#A68A64] transition-colors">
                    {t("nav.cart")}
                    <ShoppingCart size={25} strokeWidth={2.5} />
                    <span className="absolute -top-1.5 max-[360px]:left-12.5 min-[360px]:-right-2 bg-gray-800 dark:bg-[#A68A64] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {cart.length}
                    </span>
                </Link>
                <Link href="/wishlist" className="flex relative">
                    <Heart className="w-6 h-6 transition-all hover:scale-110 duration-200 text-gray-400 hover:text-red-500 cursor-pointer" />
                    <span className="absolute -top-1.5 left-3 z-10 backdrop-blur-2xl min-[360px]:-right-2 bg-gray-800 dark:bg-[#A68A64] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                        {wishlist.length}
                    </span>
                </Link>
                <ButtonTheme />
                <TranslationButton />
            </div>
            <div className="flex justify-center">
                <Auth />
            </div>
        </div>   
    </>
  )
}
