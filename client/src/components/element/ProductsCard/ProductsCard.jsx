import Image from "next/image";
import { Link } from "../../../lib/i18n/routing";
import { ShowCard, ProductsWishlistIcon } from "../../../index";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

export default function ProductsCard({data, showCard = true}) {
    const t = useTranslations();

  return (
    <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 gap-y-6">
        {data.map((product, index) => {
            const reviewsCount = Array.isArray(product?.reviews) ? product.reviews.length : product?.reviews || 0;

            return(
                <div key={index} dir="ltr" className="bg-white dark:bg-[#18221f] flex flex-col h-full group w-full max-w-[360px] mx-auto border border-[var(--color-border)] rounded-2xl overflow-hidden transition duration-300 shadow-lg hover:shadow-xl">
                    <div className="relative h-56 shrink-0 bg-[#F9F7F3] dark:bg-[#1f1b17] p-[10px]">
                        <Link href={`/products/${product.id}`} className="block w-full h-full">
                            <Image
                                src={product.image}
                                alt={product.title_en}
                                fill
                                priority={index < 5}
                                className="cursor-pointer object-cover hover:scale-105 transition duration-300"
                            />
                        </Link>

                        <div className="absolute top-0 left-0 w-fit p-2 rounded-br-3xl flex items-center justify-between bg-[var(--color-green-dark)] dark:bg-[#0f2e25]">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-base text-white">{product.price.toFixed(2)}</span>
                                {product.discountPrice ? <span className="text-xs text-gray-300 line-through">{product.discountPrice.toFixed(2)} <small className="text-xs">ر.س</small></span> : ""}
                            </div>
                        </div>
                        
                        <div className="absolute top-1 right-1 w-fit p-2 rounded-3xl flex items-center justify-between bg-white dark:bg-[#202d29] shadow-sm">
                            <ProductsWishlistIcon product={product} />
                        </div>
                    </div>

                    <div className="px-3 py-5 flex-1">
                        <div className="text-xs text-[var(--color-muted)]">{product.brand}</div>
                        <div className="font-semibold my-1 leading-[1.55] line-clamp-2 min-h-[38px]">{product.title_en}</div>
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
