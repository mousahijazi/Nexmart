import { SaleSeason, SidePromotions } from "@/index";

export default function Hero() {
  return (
    <section dir="rtl" className="max-w-[1280px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <SaleSeason />
      <SidePromotions />
    </section>
  )
}