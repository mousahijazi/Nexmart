import { getProducts } from "@/helper/fetchApi";
import { ProductsCard } from "@/index";

export default async function Products() {
    const {products} = await getProducts(4);

  return (
    <ProductsCard data={products}  showDiscount={true} showRating={true} />
  )
}
