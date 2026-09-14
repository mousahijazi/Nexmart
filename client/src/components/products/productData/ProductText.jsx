import Image from "next/image"; 
import { Purchases, ProductsTextButton } from "../../../index"; 
import { useTranslations, useLocale } from "next-intl"; 
 
export default function ProductText({data}) { 
    const t = useTranslations(); 
    const locale = useLocale(); 
 
  return ( 
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="flex flex-col gap-5 lg:justify-center"> 
        <span className="text-[var(--color-muted)] font-bold dark:text-[var(--color-gold)]">Nexmart</span> 
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--color-green-dark)] dark:text-gray-100"> 
            {data.title[locale]} 
        </h2> 
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row justify-between pb-8 border-b-2 border-[var(--color-border)] dark:border-[#22332e] border-dashed"> 
            <div className="flex gap-3 items-center max-[300px]:flex-col max-[300px]:items-start"> 
                <span className="text-3xl font-bold text-[var(--color-green-dark)] dark:text-[var(--color-gold)]"> 
                    ${data.price.toFixed(2)} 
                </span> 
                {data?.discountPrice  
                    ? <span className="text-lg line-through text-[var(--color-muted)] dark:text-gray-500"> 
                            ${data.discountPrice} 
                        </span> 
                    : "" 
                } 
            </div> 
            <div className="flex gap-3 items-center max-[300px]:flex-col max-[300px]:items-start"> 
                <span className="text-[var(--color-muted)] dark:text-gray-400 text-lg"> 
                    {data.stock} {t("shop.products.product.stocks")} 
                </span> 
                <div className="flex gap-2 items-center"> 
                    <Image  
                        src="/Star.svg" 
                        alt="Evaluation" 
                        width={25} 
                        height={25} 
                    /> 
                    <span className="text-2xl font-bold dark:text-gray-100"> 
                        {data.rating} 
                    </span> 
                </div> 
            </div> 
        </div> 
        <div> 
            <h3 dir={locale === "ar" ? "rtl" : "ltr"} className="text-2xl font-bold text-[var(--color-green-dark)] dark:text-gray-100">{t("shop.products.product.Desc")} :</h3> 
            <p className="text-[var(--color-muted)] leading-7 dark:text-gray-400">{data.description[locale]}</p> 
        </div> 
        <Purchases stock={data.stock} productPrice={data?.discountPrice} discount={data.price} /> 
        <ProductsTextButton product={data} /> 
    </div> 
  )
}