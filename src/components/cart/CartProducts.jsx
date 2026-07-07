"use client"
import { useProductContext } from "@/Context/CartProvider";
import { ProductsCard, Button, CartSkeleton } from "@/index";

export default function CartProducts() {
  const {cart, loadingCart} = useProductContext();

  return (
    loadingCart 
      ? <CartSkeleton /> 
      : cart.length === 0 
        ? <div className="text-center py-20">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5B3A21]">
              Your cart is empty
            </h2>

            <p className="mt-3 text-gray-600 md:text-lg">
              Add some products to start shopping.
            </p>

            <Button title="Shop now" link="products" />
        </div>
    :  <ProductsCard data={cart} showCard={false} />
  )
}
