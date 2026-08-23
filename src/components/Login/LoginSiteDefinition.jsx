import Image from "next/image"; 
import { useTranslations } from "next-intl"; 
 
export default function LoginSiteDefinition() { 
    const t = useTranslations(); 
 
  return ( 
    <div className="hidden min-[480px]:flex relative max-md:py-24 bg-[#F1F1F1] dark:bg-[#121a17] items-center justify-center p-10"> 
        <Image 
            src="/cart.svg" 
            alt="Login" 
            fill 
            priority 
            className="opacity-20 dark:opacity-50" 
        /> 
 
        <div className="text-center z-30"> 
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--color-green-dark)] dark:text-[var(--color-gold)]"> 
                NexMart 
            </h1> 
 
            <p className="text-[var(--color-muted)] dark:text-gray-400 text-[17px] mt-2 max-w-xs"> 
                {t("auth.Desc")} 
            </p> 
        </div> 
    </div> 
  )
}