import Link from "next/link";
import { ButtonTheme, UserImage } from "@/index";
import { ShoppingCart } from "lucide-react";
import { useProductContext } from "@/Context/CartProvider";
import { useUserContext } from "@/Context/UserProvider";

export default function Icon() {
    const {cart} = useProductContext();
    const {user, loading} = useUserContext();

  return (
    <>
        <div className="flex items-center gap-4">
            <Link href="/cart" className="flex items-center gap-1 relative text-gray-600 hover:text-gray-900 dark:text-[#D4C7BC] dark:hover:text-[#A68A64] transition-colors">
                cart 
                <ShoppingCart size={25} strokeWidth={2.5} />
                <span className="absolute -top-2 -right-2 bg-gray-800 dark:bg-[#A68A64] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                </span>
            </Link>
            <ButtonTheme />
            {loading 
                ? <div className="w-[60px] h-[60px] rounded-full bg-gray-200 shrink-0"></div> 
                : <Link href={user ? "/user" : "/login"}>
                        <UserImage />
                    </Link>
            }
        </div>   
    </>
  )
}
