import Image from "next/image";
import { Link } from "@/lib/i18n/routing";
import { ShowCard, ProductsWishlistIcon } from "@/index";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

export default function ProductsCard({data, showCard = true}) {
    const t = useTranslations();

  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6">
        {data.map((product, index) => {
            const originalPrice = product.price + (product.price * (product.discountPercentage / 100));
            const reviewsCount = Array.isArray(product?.reviews) ? product.reviews.length : product?.reviews || 0;

            return(
                <div key={index} dir="ltr" className="bg-white dark:bg-[#18221f] flex flex-col h-full group w-full max-w-[360px] mx-auto border border-[var(--color-border)] rounded-2xl overflow-hidden transition duration-300 shadow-lg hover:shadow-xl">
                    <div className="relative h-56 shrink-0 bg-[#F9F7F3] dark:bg-[#1f1b17] p-[10px]">
                        <Link href={`/products/${product.id}`} >
                            <Image
                                src={product.thumbnail}
                                alt={product.title}
                                fill
                                priority={index < 5}
                                className="cursor-pointer object-contain group-hover:scale-95 transition duration-270"
                            />
                        </Link>

                        <div className="absolute top-0 left-0 w-fit p-2 rounded-br-3xl flex items-center justify-between bg-[var(--color-green-dark)] dark:bg-[#0f2e25]">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-base text-white">{product.price.toFixed(2)} <small className="text-xs">ر.س</small></span>
                                <span className="text-xs text-gray-300 line-through">{originalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <div className="absolute top-1 right-1 w-fit p-2 rounded-3xl flex items-center justify-between bg-white dark:bg-[#202d29] shadow-sm">
                            <ProductsWishlistIcon product={product} />
                        </div>
                    </div>

                    <div className="px-3 py-5 flex-1">
                        <div className="text-xs text-[var(--color-muted)]">{product.brand}</div>
                        <div className="font-semibold my-1 leading-[1.55] line-clamp-2 min-h-[38px]">{product.title}</div>
                        <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
                            <span className="text-[var(--color-gold)]"><Star size={15} /></span>
                            <span>{product.rating} ({reviewsCount})</span>
                        </div>
                    </div>
                    <div className="relative mt-auto shrink-0 h-9">
                        <Link 
                            href={`/products/${product.id}`} 
                            className="
                            absolute bottom-0 left-0 
                            bg-[var(--color-green-dark)] text-white font-semibold 
                            p-2 px-3.5 rounded-tr-3xl cursor-pointer 
                            hover:opacity-90 transition duration-300"
                        >
                            {t("element.productCard.viewDetails")} 
                        </Link>
                        <div className="absolute bottom-0 right-0">
                            <ShowCard showCard={showCard} product={product} />
                        </div>
                    </div>
                </div>
            )
        })}
    </div>
  )
}


// import Image from "next/image";
// import { Link } from "@/lib/i18n/routing";
// import { ShowCard, ProductsWishlistIcon } from "@/index";
// import { useTranslations } from "next-intl";

// export default function ProductsCard({data, showDiscount = false, showRating = false, showCard = true}) {
//     const t = useTranslations();
    
//   return (
//     <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
//         {data.map((product, index) => {
//             const originalPrice = product.price + (product.price * (product.discountPercentage / 100));
//             return(
//                 <div 
//                     key={index} 
//                     dir="ltr"
//                     className={`
//                         w-full
//                         max-w-[360px]
//                         mx-auto
//                         bg-white dark:bg-[#181512]
//                         rounded-3xl 
//                         overflow-hidden 
//                         shadow-md dark:shadow-black/60 hover:shadow-xl 
//                         hover:-translate-y-2 
//                         transition duration-300
//                         group
//                     `}
//                 >
//                     <Link href={`/products/${product.id}`}>
//                         <div className="relative h-64 bg-[#F9F7F3] dark:bg-[#1f1b17]">
//                             <Image
//                                 src={product.thumbnail}
//                                 alt={product.title}
//                                 fill
//                                 priority={index < 4}
//                                 className="object-contain p-6 group-hover:scale-95 transition duration-270"
//                             />
                            // <div className="absolute top-0 left-0 w-fit p-2 rounded-br-3xl flex items-center justify-between text-white bg-[#5B3A21]">
                            //     <div className="flex items-center gap-2">
                            //         {showDiscount 
                            //             ? <span className="text-sm text-white p-2 font-bold">
                            //                 {t("element.productCard.newProduct")} 
                            //             </span>
                            //             : 
                            //             <>
                            //                 <span className="font-bold text-lg">
                            //                     ${product.price}
                            //                 </span>
                            //                 <span className="text-lg line-through text-gray-300">
                            //                     ${originalPrice.toFixed(2)}
                            //                 </span>
                            //             </>
                            //         }
                            //     </div>
                            // </div>
//                         </div>

//                         <div className="p-4 flex flex-col gap-2">
//                             <h1 className="font-semibold text-[#5B3A21] dark:text-[#F5EBE6] line-clamp-1">
//                                 {product.title}
//                             </h1>
//                             <p className="text-sm text-gray-500 dark:text-[#e5ded8] mt-2 line-clamp-2">
//                                 {product.description}
//                             </p>

//                             {showRating && (
//                                 <div className="dark:text-[#e5ded8]">
//                                     ⭐ {product.rating}
//                                 </div>
//                             )}
//                         </div>
//                     </Link>
//                     <div className="relative h-9">
//                         <Link 
//                             href={`/products/${product.id}`} 
//                             className="
//                             absolute bottom-0 left-0 
//                             bg-[#5B3A21] text-white font-semibold 
//                             p-2 px-3.5 rounded-tr-3xl cursor-pointer 
//                             hover:opacity-90 transition duration-300"
//                         >
//                             {t("element.productCard.viewDetails")} 
//                         </Link>
//                         <div className="absolute bottom-0 right-0 flex items-center">
//                             <ProductsWishlistIcon product={product} />
//                             <ShowCard showCard={showCard} product={product} />
//                         </div>
//                     </div>
//                 </div>
//             )
//         })}
//     </div>
//   )
// }
