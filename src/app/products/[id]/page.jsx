import { getProduct, getCategories } from "@/helper/fetchApi";
import { ProductGallary, ProductText, ProductsReviews, Rating, ProductsCard, Button } from "@/index";

export default async function Post({params}) {
    const { id } = await params;
    const data = await getProduct(id);
    const categories = await getCategories(data.category);
    const relatedProducts = categories.products.filter(
        (product) => product.id !== data.id
    );

  return (
    <>
        <div className="bg-[#f1f1f1] py-24">
            <div className="max-w-7xl mx-auto px-6">
                <p className="text-gray-700 mb-8">
                    Home / Products / {data.title}
                </p>
                <div className="bg-white rounded-2xl py-12 px-6 grid md:grid-cols-[0.9fr_1.1fr] gap-12">
                    <ProductGallary data={data} />
                    <ProductText data={data} />
                </div>
            </div>
        </div>
        <div className="bg-[#fefefe] py-24">
            <div className="max-w-7xl mx-auto px-6">
                <h1 className="mb-12 text-[#5B3A21] text-2xl font-bold">Related Products</h1>
                <ProductsCard data={relatedProducts} showRating={true} />
                <Button title="Shop Now" link="products" />
            </div>
        </div>
        <div className="bg-[#f1f1f1] py-24">
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
