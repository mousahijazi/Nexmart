import { Link } from "@/lib/i18n/routing";
import Image from "next/image";
import { ImageData } from "./data";
import { useTranslations } from "next-intl";

export default function Text() {
    const t = useTranslations();

  return (
    <div className="z-30 flex flex-col items-center text-center gap-4">
        <Link dir="ltr" href="/" className="text-2xl font-bold text-gray-800 dark:text-[#F5EBE6]">
        ⬡ Nexmart
        </Link>
        <p className="text-sm text-gray-600 dark:text-[#e5ded8] max-w-[200px]">
            {t("footer.nexmartDesc.text")}
        </p>
        <div className="flex items-center gap-4 mt-2">
        {ImageData.map((ele, index) => (
            <Link key={index} href={ele.link} target="_blank">
                <Image 
                    src={ele.url} 
                    alt={ele.alt} 
                    width={30} 
                    height={30} 
                />
            </Link>
        ))}
        </div>
    </div>
  )
}
