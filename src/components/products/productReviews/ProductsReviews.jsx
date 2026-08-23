import { ProductStars } from "@/index"; 
import Image from "next/image"; 
import { useTranslations } from "next-intl"; 
 
export default function ProductsReviews({reviews}) { 
    const t = useTranslations(); 
 
  return ( 
    <div className="mt-16"> 
        <h1 className="text-2xl text-[var(--color-green-dark)] dark:text-gray-100 font-bold">{t("shop.products.reviews.title")}</h1> 
        <div dir="ltr" className="mt-10 grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12"> 
            {reviews.map((ele, index) => ( 
                <div key={index} className="flex flex-col gap-7 bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl pl-3 xl:pr-40 md:pr-32 sm:28 min-[480px]:pr-24 max-[480px]:pr-16 py-3 shadow-sm hover:shadow-md hover:-translate-y-1 transition duration-300"> 
                    <div> 
                        <ProductStars rating={ele.rating} /> 
                        <h2 className="mb-2 text-lg text-[#12211C] dark:text-gray-100 font-bold">{ele.comment}</h2> 
                    </div> 
                    <div className="flex flex-row items-center gap-2"> 
                        <Image  
                            src="/Profile.jpg" 
                            alt={ele.reviewerName} 
                            width={60} 
                            height={60} 
                            className="rounded-full" 
                        /> 
                        <p className="text-sm text-[var(--color-muted)] dark:text-gray-400 font-semibold">{ele.reviewerName}</p> 
                    </div> 
                </div> 
            ))} 
        </div> 
    </div> 
  ) 
}