import { HeroText, StatisticsSection} from "@/index";
import Image from "next/image";

export default function Hero() {
  return (
    <div className="relative max-md:bg-[#F7F4EF] max-md:dark:bg-zinc-900 py-32 sm:py-36 sm:pt-44 lg:pt-64 lg:pb-20 px-3 sm:px-6 md:px-12">   
        <div className="hidden md:block absolute inset-0 -z-10">
          <Image
            src="/nexmart-hero.png"
            alt="Nexmart Hero Background"
            fill
            priority
            quality={80}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col z-10">
          <HeroText />
          <div className="mt-auto pt-12">
            <StatisticsSection />
          </div>
        </div>
    </div>
  );
}