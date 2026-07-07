import { getProducts, getCategories } from "@/helper/fetchApi";
import { ProductsContainer, ProductsText } from "@/index";

export default async function ProductsPage() {
  const { products, total } = await getProducts();
  const categories = await getCategories();

  return (
    <div className="bg-[#f1f1f1] py-24">
      <ProductsText total={total} />
      <ProductsContainer data={products} totalProducts={total} categories={categories} />
    </div>
  );
}