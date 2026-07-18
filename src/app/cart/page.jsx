import { Cart, CartDashbaord } from "@/index";

export const metadata = {
  title: "Nexmart - cart",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default function CartPage() {
  return (
    <>
      <div className="bg-[#F9F6F0] dark:bg-zinc-900 min-h-screen py-32 md:py-36">
        <div className="max-w-7xl mx-auto px-6">
            <Cart /> 
        </div>
      </div>
      <div className="bg-[#f2f2f2] dark:bg-zinc-800 py-24">
        <div className="max-w-7xl mx-auto px-6">
            <CartDashbaord /> 
        </div>
      </div>
    </>
  )
}
