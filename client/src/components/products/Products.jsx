import { Suspense } from "react";
import { getJSONProducts } from "../../helper/fetchApi";
import { ProductsContainer, ProductsText, Loader } from "../../index";

export default async function ProductsPage() {
  const { products, total } = await getJSONProducts();

  return (
    <div className="py-32 sm:36 md:py-16 lg:pb-24 lg:pt-20" id="products">
      <ProductsText total={total} />
      <Suspense fallback={<Loader />}>
        <ProductsContainer data={products} totalProducts={total} />
      </Suspense>
    </div>
  );
}