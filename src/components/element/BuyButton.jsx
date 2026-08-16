"use client" 
import { useRouter } from "@/lib/i18n/routing"; 
import { useProductContext } from "@/Context/CartProvider"; 
import { useCheckoutContext } from "@/Context/CheckoutProvider"; 
import { useAlertContext } from "@/Context/AlertProvider"; 
import { useUserContext } from "@/Context/UserProvider"; 
import { useTranslations } from "next-intl"; 
 
export default function BuyButton({products = false, singleProduct}) { 
  const router = useRouter(); 
  const t = useTranslations(); 
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
    <button className="w-full font-semibold sm:w-1/2 bg-white dark:bg-[#18221f] text-[var(--color-green-dark)] dark:text-gray-100 border-2 border-[var(--color-green-dark)] dark:border-[#22332e] hover:bg-[var(--color-green-dark)] hover:text-white dark:hover:bg-[#22332e] px-6 py-3 rounded-2xl cursor-pointer transition duration-300" aria-label={t("element.checkout")} onClick={handleCheckout}>{t("element.checkout")}</button> 
  ) 
}