import { CartDashbaord } from "@/index";

export default function page() {
  return (
    <div className="bg-[#f2f2f2] dark:bg-zinc-800 py-24">
        <div className="max-w-7xl mx-auto px-6">
            <CartDashbaord showCartData={false} /> 
        </div>
    </div>
  )
}
