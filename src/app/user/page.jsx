import { CartDashbaord } from "@/index";

export const metadata = {
  title: "Nexmart - profile",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default function page() {
  return (
    <div className="bg-[#f2f2f2] dark:bg-zinc-800 py-28 min-[500px]:px-6 min-[500px]:py-32 sm:py-40">
        <div className="max-w-7xl mx-auto min-[500px]:px-6">
            <CartDashbaord showCartData={false} /> 
        </div>
    </div>
  )
}
