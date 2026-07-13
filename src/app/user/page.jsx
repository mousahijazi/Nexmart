import { CartDashbaord } from "@/index";

export const metadata = {
  title: "Nexmart - profile",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default function page() {
  return (
    <div className="bg-[#f2f2f2] dark:bg-zinc-800 py-24">
        <div className="max-w-7xl mx-auto px-6">
            <CartDashbaord showCartData={false} /> 
        </div>
    </div>
  )
}
