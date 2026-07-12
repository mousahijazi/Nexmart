import { Products, Button, Loader } from "@/index";
import { Suspense } from "react";

export default function FeaturedProducts() {
    return (
        <div className="bg-[#e3dfd7] dark:bg-zinc-800 py-20 sm:py-24 lg:py-36 px-3 sm:px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-[#5B3A21] dark:text-[#F5EBE6]"> Featured Products </h1>
                    <p className="mt-3 text-gray-700 dark:text-[#e5ded8] text-lg">
                        Discover our latest and most popular products.
                    </p>
                </div>
                <Suspense fallback={<Loader />}>
                    <Products />
                </Suspense>
                <Button title="Shop Now" link="products" />
            </div>
        </div>
    );
}