"use client"
import { ProductsCard, EmptyWishlist } from "@/index";
import { useWishlistContext } from "@/Context/WishlistProvider";

export default function WishlistProducts() {
    const {wishlist, loadingWishlist} = useWishlistContext();

  return (
    <>
        {loadingWishlist 
          ?  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="
                      w-full
                      max-w-[360px]
                      mx-auto
                      rounded-3xl
                      overflow-hidden
                      bg-white dark:bg-[#181512]
                      shadow-md dark:shadow-black/60
                      animate-pulse
                    "
                  >
                    <div className="h-64 bg-[#F7F4EF] dark:bg-[#1f1b17]" />

                    <div className="p-4 space-y-4">
                      <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-zinc-700" />

                      <div className="space-y-2">
                        <div className="h-3 rounded bg-gray-200 dark:bg-zinc-700" />
                        <div className="h-3 w-5/6 rounded bg-gray-200 dark:bg-zinc-700" />
                      </div>

                      <div className="h-4 w-20 rounded bg-gray-200 dark:bg-zinc-700" />
                    </div>

                    <div className="flex justify-between items-center px-4 pb-4">
                      <div className="h-10 w-28 rounded-xl bg-gray-200 dark:bg-zinc-700" />

                      <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-zinc-700" />
                        <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-zinc-700" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          : wishlist.length === 0
              ? <EmptyWishlist />
              : <ProductsCard data={wishlist} showRating={true} showCard={true} />
        }
    </>
  )
}
