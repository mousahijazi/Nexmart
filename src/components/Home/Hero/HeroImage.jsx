import Image from "next/image";

export default function HeroImage() {
  return (
    // todo
    <div className="hidden lg:flex justify-center">
        <Image
            src="/HomeHero.jpg"
            alt="Medicine products"
            width={550}
            height={550}
            className="w-full shadow-md max-w-lg rounded-3xl duration-300 hover:-translate-y-3 hover:shadow-xl dark:shadow-black/60 dark:hover:shadow-lg z-10"
            priority
        />
    </div>
  )
}
