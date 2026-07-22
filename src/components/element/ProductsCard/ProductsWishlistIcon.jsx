"use client"
import { Heart } from "lucide-react";
import { useWishlistContext } from "@/Context/WishlistProvider";

export default function ProductsWishlistIcon({ product }) {
  const {isInWishlist, toggleWishlist} = useWishlistContext();
  const active = isInWishlist(product.id);

  return (
    <button 
        type="button"
        onClick={() => toggleWishlist(product)}
        className="z-10"
        aria-label="Add to favorites"
    >
        <Heart fill={active ? "currentColor" : "none"} className={`w-6 h-6 transition-all hover:scale-110 duration-200 text-gray-400 hover:text-red-500 cursor-pointer ${active ? "text-red-500" : ""}`} />
    </button>
  )
}
