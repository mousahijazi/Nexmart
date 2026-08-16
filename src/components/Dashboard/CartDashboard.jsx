import { Button, BuyButton, Text, DashboardData, ClearCartButton } from "@/index"; 
import { useTranslations } from "next-intl"; 
 
export default function CartDashboard() { 
    const t = useTranslations(); 
 
  return ( 
    <div className="bg-white dark:bg-[#18221f] border border-transparent dark:border-[#22332e] shadow-lg py-12 px-6 rounded-2xl grid grid-cols-1 lg:grid-cols-2 transition duration-300"> 
        <div className="flex flex-col justify-center items-start gap-7"> 
            <div className=""> 
                <span className="text-xs font-bold tracking-widest text-[var(--color-green-dark)]/80 dark:text-[var(--color-gold)] uppercase mb-1"> 
                    {t("cart.cartDashboard.title")} 
                </span> 
                <h1 className="text-2xl min-[480px]:text-3xl md:text-4xl font-extrabold text-[var(--color-green-dark)] dark:text-gray-100 tracking-tight"> 
                    {t("cart.cartDashboard.Desc")} 
                </h1> 
            </div> 
            <DashboardData /> 
            <div className="flex max-sm:flex-col w-full items-center gap-5"> 
                <BuyButton products={true} /> 
                <ClearCartButton />    
            </div> 
        </div> 
 
        <div className="flex flex-col justify-end items-center gap-5 max-lg:mt-12"> 
            <Text /> 
            <Button title={t("cart.cartDashboard.button")} link="products" /> 
        </div> 
    </div> 
  ) 
}