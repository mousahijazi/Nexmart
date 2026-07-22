"use client"
import { useWishlistContext } from "@/Context/WishlistProvider";
import { Star } from "lucide-react";

export default function WishlistDashboardData() {
    const {wishlist} = useWishlistContext();
    const totalPrice = wishlist.reduce((total, product) => total + product.price, 0);
    const averageRating = wishlist.length === 0 ? 0 : (wishlist.reduce((sum, product) => sum + product.rating, 0) / wishlist.length).toFixed(1);
    const totalBrands = new Set(wishlist.map(product => product.brand)).size;
    const wishlistData = [
        {
            title: "Total Products",
            value: wishlist.length,
        },
        {
            title: "Total Price",
            value: `$${totalPrice.toFixed(2)}`,
        },
        {
            title: "Average Rating",
            value: averageRating,
            icon: <Star />,
        },
        {
            title: "Total Brands",
            value: totalBrands,
        },
    ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mt-8 gap-3">
        {wishlistData.map(({title, value, icon}, index) => (
            <div key={index} className="w-full px-5 py-6 rounded-2xl flex flex-col gap-3 bg-[#fefefe] min-[480px]:bg-[#F7F4EF] dark:bg-[#1F1B17]">
                <span className="text-[16px] text-gray-600 dark:text-zinc-300 font-semibold">
                    {title}
                </span>
                <h2 className="text-2xl font-bold flex items-center gap-3 text-[#5B3A21] dark:text-[#F5EBE6]">
                    {value}
                    {icon ? icon : null}
                </h2>
            </div>
        ))}
    </div>
  )
}
