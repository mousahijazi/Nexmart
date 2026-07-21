import { Heart } from "lucide-react";

export default function ProductsWishlistIcon() {
  return (
    <button 
        type="button"
        className="z-10"
        aria-label="Add to favorites"
    >
        <Heart className="w-6 h-6 transition-all hover:scale-110 duration-200 text-gray-400 hover:text-red-500 cursor-pointer" />
    </button>
  )
}
