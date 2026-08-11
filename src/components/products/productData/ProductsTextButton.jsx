"use client"
import { useProductContext } from "@/Context/CartProvider";
import { BuyButton } from "@/index";
import { useTranslations } from "next-intl";

export default function ProductsTextButton({product}) {
    const t = useTranslations();
    const { addToStorage } = useProductContext();
    const handleAdd = () => {
        addToStorage(product);
    };

  return (
    <div className="flex flex-col items-center max-[480px]:items-start sm:flex-row gap-2">
        <button className="w-full sm:w-1/2 bg-[#5B3A21] text-white px-6 py-3 rounded-2xl hover:opacity-90 transition duration-200 cursor-pointer" onClick={handleAdd}>{t("element.addToCart")}</button>
        <BuyButton singleProduct={product} />
    </div>
  )
}
