import Image from "next/image";
import Link from "next/link";
import { ShowCard, ProductsWishlistIcon } from "@/index";

export default function ProductsCard({data, showDiscount = false, showRating = false, showCard = true}) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {data.map((product, index) => (
            <div 
                key={index} 
                className={`
                    w-full
                    max-w-[360px]
                    mx-auto
                    bg-white dark:bg-[#181512]
                    rounded-3xl 
                    overflow-hidden 
                    shadow-md dark:shadow-black/60 hover:shadow-xl 
                    hover:-translate-y-2 
                    transition duration-300
                    group
                `}
            >
                <Link href={`/products/${product.id}`}>
                    <div className="relative h-64 bg-[#F9F7F3] dark:bg-[#1f1b17]">
                        <Image
                            src={product.thumbnail}
                            alt={product.title}
                            fill
                            priority
                            className="object-contain p-6 group-hover:scale-95 transition duration-270"
                        />
                        <div className="absolute top-0 left-0 w-fit p-2 rounded-br-3xl flex items-center justify-between text-white bg-[#5B3A21]">
                            <div className="flex items-center gap-2">
                                {showDiscount 
                                    ? <span className="text-sm text-white p-2 font-bold">
                                        New 
                                      </span>
                                    : 
                                    <>
                                        <span className="font-bold text-lg">
                                            ${product.price}
                                        </span>
                                        <span className="text-lg line-through text-gray-300">
                                            ${product.discountPercentage}
                                        </span>
                                    </>
                                }
                            </div>
                        </div>
                    </div>

                    <div className="p-4 flex flex-col gap-2">
                        <h1 className="font-semibold text-[#5B3A21] dark:text-[#F5EBE6] line-clamp-1">
                            {product.title}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-[#e5ded8] mt-2 line-clamp-2">
                            {product.description}
                        </p>

                        {showRating && (
                            <div className="dark:text-[#e5ded8]">
                                ⭐ {product.rating}
                            </div>
                        )}
                    </div>
                </Link>
                <div className="relative h-9">
                    <Link href={`/products/${product.id}`} className="
                        absolute bottom-0 left-0 
                        bg-[#5B3A21] text-white font-semibold 
                        p-2 rounded-tr-3xl cursor-pointer 
                        hover:opacity-90 transition duration-300">
                        View Details
                    </Link>
                    <div className="absolute bottom-0 right-0 flex items-center">
                        <ProductsWishlistIcon />
                        <ShowCard showCard={showCard} product={product} />
                    </div>
                </div>
            </div>
        ))}
    </div>
  )
}
