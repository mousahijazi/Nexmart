import { HeroText, StatisticsSection} from "@/index";

export default function Hero() {
  return (
    <div className="bg-[#F7F4EF] dark:bg-zinc-900 md:bg-[url('/nexmart-hero.png')] md:bg-cover md:bg-center md:bg-no-repeat py-32 sm:py-36 sm:pt-44 lg:pt-64 lg:pb-20 px-3 sm:px-6 md:px-12">   
        <div className="max-w-7xl mx-auto flex flex-col">
          <HeroText />
          <div className="mt-auto pt-12">
            <StatisticsSection />
          </div>
        </div>
    </div>
  );
}