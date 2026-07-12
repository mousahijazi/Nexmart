import { ProductStars } from "@/index";
import Image from "next/image";

export default function ProductsReviews({reviews}) {
  return (
    <div className="mt-16">
        <h1 className="text-2xl text-[#5B3A21] dark:text-[#F5EBE6] font-bold">Review Lists</h1>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-12">
            {reviews.map((ele, index) => {
            return  <div key={index} className="flex flex-col gap-7 bg-[#fefefe] dark:bg-zinc-950 rounded-2xl pl-3 xl:pr-40 md:pr-32 sm:28 min-[480px]:pr-24 max-[480px]:pr-16 py-3 shadow-lg dark:shadow-black/90 hover:shadow-xl hover:-translate-y-3 transition duration-300">
                        <div>
                            <ProductStars rating={ele.rating} />
                            <h2 className="mb-2 text-lg text-[#5B3A21] dark:text-[#A68A64] font-bold">{ele.comment}</h2>
                            <p className="text-gray-600 dark:text-[#e5ded8] pr-2 max-[400px]:text-sm">
                                {new Date(ele.date).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}</p> {/*Converting the date from its strange API format to a human-readable version. */}
                        </div>
                        <div className="flex flex-row items-center gap-2">
                            <Image 
                                src="/Profile.jpg"
                                alt={ele.reviewerName}
                                width={60}
                                height={60}
                                className="rounded-full"
                            />
                            <p className="text-sm text-[#5B3A21] dark:text-[#e5ded8] font-semibold">{ele.reviewerName}</p>
                        </div>
                    </div>
            })}
        </div>
    </div>
  )
}
