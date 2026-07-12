import Image from "next/image";

export default function LoginSiteDefinition() {
  return (
    <div className="relative max-md:py-24 bg-[#F9F7F3] dark:bg-zinc-900 flex items-center justify-center p-10">
        <Image
            src="/cart.svg"
            alt="Login"
            fill
            priority
            className="opacity-20 dark:opacity-50"
        />

        <div className="text-center z-30">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#5B3A21] dark:text-[#A68A64]">
                NexMart
            </h1>

            <p className="text-gray-600 dark:text-[#e5ded8] text-[17px] mt-2 max-w-xs">
                Your favorite place for discovering amazing products.
            </p>
        </div>
    </div>
  )
}
