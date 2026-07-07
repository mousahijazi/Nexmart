import { Cart, CartDashbaord } from "@/index";

export default function CartPage() {
  return (
    <>
      <div className="bg-[#F9F6F0] min-h-screen py-24">
        <div className="max-w-7xl mx-auto px-6">
            <Cart /> 
        </div>
      </div>
      <div className="bg-[#f2f2f2] py-24">
        <div className="max-w-7xl mx-auto px-6">
            <CartDashbaord /> 
        </div>
      </div>
    </>
  )
}
