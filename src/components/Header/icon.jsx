import Link from "next/link";
import { ButtonTheme, Auth } from "@/index";
import { ShoppingCart } from "lucide-react";
import { useProductContext } from "@/Context/CartProvider";

export default function Icon() {
    const {cart} = useProductContext();

  return (
    <>
        <div className="flex flex-wrap max-[360px]:justify-center items-center gap-4">
            <Link href="/cart" className="max-[360px]:px-3 flex items-center gap-1 relative text-gray-600 hover:text-gray-900 dark:text-[#D4C7BC] dark:hover:text-[#A68A64] transition-colors">
                cart 
                <ShoppingCart size={25} strokeWidth={2.5} />
                <span className="absolute -top-2 max-[360px]:left-16 min-[360px]:-right-2 bg-gray-800 dark:bg-[#A68A64] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                </span>
            </Link>
            <ButtonTheme />
            <Auth />
        </div>   
    </>
  )
}
