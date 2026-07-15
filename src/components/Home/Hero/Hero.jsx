import { HeroImage, HeroText } from "@/index";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-[#F7F4EF] dark:bg-zinc-900 py-28 sm:py-36 lg:py-48 px-3 sm:px-6 md:px-12">
        <div className="absolute left-0 top-0 w-full lg:w-2/3 h-full pointer-events-none opacity-40 dark:opacity-20 select-none z-0">
          <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100 100C150 150 200 400 450 350C700 300 650 550 850 600" stroke="url(#ornament-gradient)" strokeWidth="2" strokeDasharray="5 5"/>
            <path d="M-50 50C200 120 180 350 500 280C820 210 700 580 900 550" stroke="url(#ornament-gradient)" strokeWidth="1.5"/>
            <path d="M-150 200C50 220 300 450 400 420C500 390 580 500 750 480" stroke="url(#ornament-gradient)" strokeWidth="1"/>
            <defs>
              <linearGradient id="ornament-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#A68A64" stopOpacity="0.8"/>
                <stop offset="50%" stopColor="#5B3A21" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#A68A64" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <HeroText />
          <HeroImage />
        </div>
    </div>
  );
}