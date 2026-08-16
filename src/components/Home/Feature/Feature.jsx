import { getProducts, getCategories } from "@/helper/fetchApi";
import { ProductsCard, Loader } from "@/index";
import { Suspense } from "react";
import { Link } from "@/lib/i18n/routing";
import { getTranslations } from "next-intl/server";

export default async function Feature() {
    const t = await getTranslations();
    const products =  await getProducts(5);
    const categories = await getCategories();
    const tabs = [
        { name: "الكل", slug: "all" },
        ...categories.slice(0, 4).map((cat) => ({
        name: cat.name || cat.slug || cat,
        slug: cat.slug || cat,
        })),
    ];

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-[22px] gap-4 flex-wrap">
            <h2 className="text-[28px] text-[var(--color-green-dark)] dark:text-[var(--color-gold)] font-bold">{t("home.feature.title")}</h2>
            <div className="flex gap-2 flex-wrap">
                {tabs.map((ele, index) => (
                    <Link key={index} href={ele.slug === "all" ? "/products#products" :`/products?category=${ele.slug}#products`}>
                        <div className="border border-[var(--color-field)] bg-white dark:bg-[var(--color-gold)] dark:text-white rounded-full px-4 py-[7px] text-[13.5px] cursor-pointer hover:border-[var(--color-green)] hover:text-[var(--color-green)] transition duration-300">{ele.name}</div>
                    </Link>
                ))}
            </div>
        </div>
        <Suspense fallback={<Loader />}>
            <ProductsCard data={products.products} />
        </Suspense>
    </section>
  )
}
