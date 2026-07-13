import { Button } from "@/index";

export default function HeroText() {
  return (
    <div className="flex flex-col items-start gap-4 sm:gap-6 lg:gap-8 max-w-2xl"> 
        <h1 className="pb-2 pt-1 bg-gradient-to-b from-[#5B3A21] dark:from-[#A68A64] dark:to-[#EDE0D4] to-[#A68A64] bg-clip-text text-transparent text-3xl min-[360px]:text-4xl sm:text-5xl lg:text-5xl xl:6xl font-extrabold flex flex-col gap-1.5">
            <span>Your trusted care</span>
            <span>now and always</span>
        </h1>
        <p className="mt-5 text-gray-600 dark:text-[#D4C7BC] sm:text-lg leading-relaxed max-w-lg">
            Discover a smarter way to shop. From everyday essentials to exclusive finds,
            explore high-quality products backed by secure checkout and lightning-fast delivery.
        </p>
        <Button title="Shop Now" link="products" />
    </div>
  )
}