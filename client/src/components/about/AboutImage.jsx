import Image from "next/image";

export default function AboutImage() {
  return (
    <Image
        src="/MousaHijazi.jpg"
        alt="Mousa Ahmed Hijazi"
        fill
        className="object-cover"
    />
  )
}
