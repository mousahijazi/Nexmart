import { getProduct, getCategories } from "@/helper/fetchApi";
import { ProductGallary, ProductText, ProductsReviews, Rating, ProductsCard, Button } from "@/index";
import { getTranslations } from "next-intl/server";

export const metadata = {
  title: "Nexmart - shop - product",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default async function Product({params}) {
    const { id } = await params;
    const data = await getProduct(id);
    const categories = await getCategories(data.category, 4);
    const t = await getTranslations();
    const relatedProducts = categories.products.filter(
        (product) => product.id !== data.id
    );

  return (
    <>
        <div className="bg-[#f1f1f1] dark:bg-zinc-900 py-32 md:py-36">
            <div className="max-w-7xl mx-auto px-2 min-[480px]:px-6">
                <p className="text-gray-600 dark:text-[#e5ded8] font-semibold mb-8 flex max-sm:flex-col gap-2">
                    {t("shop.products.product.title", { count: data.category })} 
                    <span className="text-[#5B3A21] dark:text-[#A68A64]">{data.title}</span>
                </p>
                <div dir="ltr" className="min-[480px]:bg-white min-[480px]:dark:bg-zinc-950 min-[480px]:shadow-xl dark:shadow-black/60 rounded-2xl py-6 min-[480px]:py-12 px-2 min-[480px]:px-6 grid md:grid-cols-[0.9fr_1.1fr] gap-12">
                    <ProductGallary data={data} />
                    <ProductText data={data} />
                </div>
            </div>
        </div>
        <div className="bg-[#fefefe] dark:bg-zinc-800 py-24">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="mb-12 text-[#5B3A21] dark:text-[#F5EBE6] text-2xl font-bold">{t("shop.products.relatedProducts.title")}</h1>
                <ProductsCard data={relatedProducts} showRating={true} />
                <div className="mt-7">
                    <Button title={t("shop.products.relatedProducts.button")} link="products" />
                </div>
            </div>
        </div>
        <div className="bg-[#f1f1f1] dark:bg-zinc-900 py-24">
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
