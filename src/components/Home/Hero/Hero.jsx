import { HeroText, HomeCard} from "@/index";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative max-sm:bg-[#F7F4EF] max-sm:dark:bg-zinc-900 py-32 sm:py-36 sm:pt-44 lg:pt-48 lg:pb-20 px-3 sm:px-6 md:px-12">   
        <div className="hidden sm:block absolute inset-0 -z-10">
          <Image
            src="/hero.png"
            alt="Nexmart Hero Background"
            fill
            priority
            quality={90} 
            sizes="100vw"
            className="object-cover object-center opacity-85"
          />
        </div>
        <div className="max-w-7xl mx-auto flex items-center flex-col z-10">
          <HeroText />
          <div className="mt-auto pt-12 text-center">
            <HomeCard />
          </div>
        </div>
    </div>
  );
}