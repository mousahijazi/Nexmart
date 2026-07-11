import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { useProductContext } from "@/Context/CartProvider";
import { useUserContext } from "@/Context/UserProvider";
import { LoginButton } from "@/index";

export default function Icon() {
    const {cart} = useProductContext();
    const {user} = useUserContext();

  return (
    <>
        <div className="flex items-center gap-4">
            <Link href="/cart" className="flex items-center gap-1 relative text-gray-600 hover:text-gray-900 transition-colors">
                cart 
                <ShoppingCart size={25} strokeWidth={2.5} />
                <span className="absolute -top-2 -right-2 bg-gray-800 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {cart.length}
                </span>
            </Link>
            <LoginButton />
            {user && (
                <Link href={`/user/${user?.id}`}>
                    <Image
                        src={user?.image || `/Profile.jpg`}
                        alt={user?.firstName || "Guest"}
                        width={60}
                        height={60}
                        className="rounded-full bg-gray-400 cursor-pointer"
                    />
                </Link>
            )}
        </div>   
    </>
  )
}
