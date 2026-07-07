import Image from "next/image";
import { Purchases, ProductsTextButton } from "@/index";

export default function ProductText({data}) {
  return (
    <div className="flex flex-col gap-5 lg:justify-center">
        <span className="text-gray-500">Nexmart</span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5B3A21]">
            {data.title}
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row justify-between pb-8 border-b-2 border-gray-400 border-dashed">
            <div className="flex gap-3 items-center max-[300px]:flex-col max-[300px]:items-start">
                <span className="text-lg line-through text-gray-600">
                    ${data.discountPercentage}
                </span>
                <span className="text-3xl font-bold text-[#5B3A21]">
                    ${data.price}
                </span>
            </div>
            <div className="flex gap-3 items-center max-[300px]:flex-col max-[300px]:items-start">
                <span className="text-gray-600 text-lg">
                    {data.stock} Stocks 
                </span>
                <div className="flex gap-2 items-center">
                    <Image 
                        src="/Star.svg"
                        alt="Evaluation"
                        width={25}
                        height={25}
                    />
                    <span className="text-2xl font-bold">
                        {data.rating}
                    </span>
                </div>
            </div>
        </div>
        <div>
            <h3 className="text-2xl font-bold text-[#5B3A21]">Description:</h3>
            <p className="text-gray-600 leading-7">{data.description}</p>
        </div>
        <Purchases stock={data.stock} productPrice={data.price} discount={data.discountPercentage} />
        <ProductsTextButton product={data} />
    </div>
  )
}
