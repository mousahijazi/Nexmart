import { Button } from "@/index";

export default function HeroText() {
  return (
    <div className="flex flex-col items-start gap-10 sm:max-w-3/4 lg:max-w-full">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#5B3A21] dark:text-[#F5EBE6] leading-tight">
            Your trusted care now and always
        </h1>
        <p className="text-gray-700 dark:text-[#e5ded8] text-lg max-w-md">
            Discover a smarter way to shop. From everyday essentials to exclusive finds,
            explore high-quality products backed by secure checkout and lightning-fast delivery.
        </p>
        <Button title="Shop Now" link="products" />
    </div>
  )
}
