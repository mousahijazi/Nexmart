import { Hero, StorePerks, Feature, WhySection, Categories } from "@/index"

export default function Home() {
  return (
    <div className="max-sm:bg-[linear-gradient(115deg,#0B3B2E_0%,#0E4D3A_55%,#12604A_100%)]">
      <Hero />
      <StorePerks />
      <Categories />
      <Feature />
      <WhySection />
    </div>
  )
}
