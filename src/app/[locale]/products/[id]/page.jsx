import { getJSONProduct, getJSONCategories } from "@/helper/fetchApi"; 
import { ProductGallary, ProductText, ProductsReviews, Rating, ProductsCard, Button } from "@/index"; 
import { getTranslations } from "next-intl/server"; 
 
export const metadata = { 
  title: "Nexmart - shop - product", 
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.", 
}; 
 
export default async function Product({params}) { 
    const { id } = await params; 
    const data = await getJSONProduct(id); 
    const categories = await getJSONCategories(data.category, 4); 
    const t = await getTranslations(); 
    const relatedProducts = categories.filter( 
        (product) => product.id !== data.id 
    ); 
 
  return ( 
    <> 
        <div className="py-32 md:py-36"> 
            <div className="max-w-7xl mx-auto px-2 min-[480px]:px-6"> 
                <p className="text-[var(--color-muted)] dark:text-gray-400 font-semibold mb-8 flex max-sm:flex-col gap-2"> 
                    {t("shop.products.product.title", { count: data.category })}  
                    <span className="text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">{data.title}</span> 
                </p> 
                <div dir="ltr" className="min-[480px]:bg-white min-[480px]:dark:bg-[#18221f] min-[480px]:border min-[480px]:border-[var(--color-border)] min-[480px]:dark:border-[#22332e] min-[480px]:shadow-md dark:shadow-black/40 rounded-2xl py-6 min-[480px]:py-12 px-2 min-[480px]:px-6 grid md:grid-cols-[0.9fr_1.1fr] gap-12"> 
                    <ProductGallary data={data} /> 
                    <ProductText data={data} /> 
                </div> 
            </div> 
        </div> 
        {relatedProducts.length !== 0 
            ? <div className="py-24"> 
                    <div className="max-w-7xl mx-auto px-6"> 
                        <h1 className="mb-12 text-[var(--color-green-dark)] dark:text-gray-100 text-2xl font-bold">{t("shop.products.relatedProducts.title")}</h1> 
                        <ProductsCard data={relatedProducts} showRating={true} /> 
                        <div className="mt-7"> 
                            <Button title={t("shop.products.relatedProducts.button")} link="products" /> 
                        </div> 
                    </div> 
                </div> 
            : "" 
        } 
        <div className="py-24"> 
            <div className="max-w-8xl mx-auto px-6"> 
                <div className="flex flex-col items-center"> 
                    <Rating rating={data.rating} /> 
                    <ProductsReviews reviews={data.reviews} /> 
                </div> 
            </div> 
        </div> 
    </> 
  ) 
}