import { Button } from "@/index";

export default function HeroText() {
  return (
    <div className="flex flex-col items-start gap-4 sm:gap-6 lg:gap-8 max-w-2xl"> 
        <h1 className="pb-2 pt-1 bg-gradient-to-b from-[#83542F] to-[#C28B4D] bg-clip-text text-transparent md:drop-shadow-[0_3px_3px_rgba(0,0,0,0.45)] text-3xl min-[360px]:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold flex flex-col gap-1.5">
            <span>Your trusted care</span>
            <span>now and always</span>
        </h1>
        <p className="mt-5 text-gray-600 dark:text-[#e9e4df] md:drop-shadow-[0_2px_2px_rgba(0,0,0,0.45)] sm:text-lg leading-relaxed max-w-lg">
          Discover quality products, secure checkout, and fast delivery — all in one place.
        </p>
        <Button title="Shop Now" link="products" />
    </div>
  )
}