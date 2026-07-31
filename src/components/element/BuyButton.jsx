"use client"
import { useRouter } from "next/navigation";
import { useProductContext } from "@/Context/CartProvider";
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { useAlertContext } from "@/Context/AlertProvider";
import { useUserContext } from "@/Context/UserProvider";

export default function BuyButton({products = false, singleProduct}) {
  const router = useRouter();
  const {cart} = useProductContext();
  const {user} = useUserContext();
  const {showAlert} = useAlertContext();
  const { checkoutCart, checkoutSingleProduct } = useCheckoutContext();
  const handleCheckout = () => {
    if (!user) {
      showAlert("please login to open this page", "danger");
      return ;
    }
    if (products) {
      if (cart && cart.length > 0) {
        checkoutCart(cart);
        router.push("/checkout?mode=address");
      } else {
        showAlert("your cart is empty!", "danger");
      }
    } else if (singleProduct) {
      checkoutSingleProduct(singleProduct);
      router.push("/checkout?mode=address");
    }
  };

  return (
    <button className="w-full font-semibold sm:w-1/2 bg-white text-[#5B3A21] border-2 border-[#5B3A21] px-6 py-3 rounded-2xl cursor-pointer" aria-label="checkout" onClick={handleCheckout}>Checkout</button>
  )
}

