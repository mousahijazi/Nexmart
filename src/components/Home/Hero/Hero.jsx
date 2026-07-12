import { HeroImage, HeroText } from "../../../index";

export default function Hero() {
  return (
    <div className="bg-[#F7F4EF] sm:py-36 lg:py-44 px-3 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <HeroText />
          <HeroImage />
        </div>
    </div>
  );
}