import Image from "next/image";

export default function HeroImage() {
  return (
    <div className="hidden lg:flex justify-center">
        <Image
            src="/landing-image.jpg"
            alt="Medicine products"
            width={550}
            height={550}
            className="w-full shadow-md max-w-lg object-contain rounded-3xl duration-300 hover:-translate-y-4 hover:shadow-xl"
            priority
        />
    </div>
  )
}
