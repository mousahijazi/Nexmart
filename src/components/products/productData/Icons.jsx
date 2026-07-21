import { iconsData } from "./data";
import { ProductsWishlistIcon } from "@/index";
import Image from "next/image";

export default function Icons() {
    const iconGroups = [
        iconsData.slice(0, 2),
        iconsData.slice(2),
    ];

  return (
    <>
        {iconGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="flex sm:flex-col gap-4">
                {group.map((icon, index) => (
                    icon.url 
                    ? <Image
                            key={icon.alt}
                            src={icon.url}
                            alt={icon.alt}
                            width={35}
                            height={35}
                            className="bg-[#f2f2f2] dark:bg-zinc-200 rounded-sm p-2 cursor-pointer sm:w-11 sm:h-11"
                        />
                    : <div key={index} className="flex items-center justify-center bg-[#f2f2f2] dark:bg-zinc-200 rounded-sm p-2 cursor-pointer">
                            <ProductsWishlistIcon />
                        </div>
                ))}
            </div>
        ))}
    </>
  )
}

