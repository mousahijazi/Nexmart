import Link from "next/link";
import { HeartCrack } from "lucide-react";

export default function EmptyWishlist() {
  return (
    <div className="min-[480px]:bg-white min-[480px]:dark:bg-[#181512] rounded-2xl min-[480px]:shadow-md dark:shadow-black/60 min-[480px]:p-20 text-center">
      <div className="w-24 h-24 mx-auto rounded-full bg-[#F7F4EF] dark:bg-[#1F1B17] flex items-center justify-center">
        <HeartCrack size={42} className="text-[#5B3A21]"/>
      </div>
      <h2 className="min-[480px]:mt-8 text-3xl font-bold text-[#5B3A21] dark:text-[#F5EBE6]">
        Your Wishlist is Empty
      </h2>
      <p className=" mt-3 text-gray-500 dark:text-[#D4C7BC]">
        Start adding products you love to find them here later.
      </p>
      <Link href="/products" 
        className="
          inline-block
          mt-8
          px-8
          py-3
          rounded-xl
          bg-[#5B3A21]
          text-white
          font-semibold
          hover:opacity-90
          transition
        "
      >
        Browse Products
      </Link>
    </div>
  );
}