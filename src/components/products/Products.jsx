import { Suspense } from "react";
import { getProducts, getCategories } from "@/helper/fetchApi";
import { ProductsContainer, ProductsText, Loader } from "@/index";

export default async function ProductsPage() {
  const { products, total } = await getProducts();
  const categories = await getCategories();

  return (
    <div className="bg-[#f1f1f1] dark:bg-zinc-800 py-28 md:py-32 lg:pt-36 lg:pb-24">
      <ProductsText total={total} />
      <Suspense fallback={<Loader />}>
        <ProductsContainer data={products} totalProducts={total} categories={categories} />
      </Suspense>
    </div>
  );
}