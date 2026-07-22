import { Dashbaord, WishlistProducts } from "@/index";

export default function Wishlist() {
  return (
    <section className="bg-[#F7F4EF] dark:bg-zinc-950 min-h-screen py-32 md:py-36 px-3 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <Dashbaord showData="wishlistDashboard" />
        <WishlistProducts />
      </div>
    </section>
  )
}
