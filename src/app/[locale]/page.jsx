import { Hero, StorePerks, FlashDeals, Feature, Categories, NewArrivalsBanner, Brand, Reviews, BlogSection } from "@/index"

export default function Home() {
  return (
    <div>
      <Hero />
      <StorePerks />
      <Categories />
      <FlashDeals />
      <Feature />
      <NewArrivalsBanner />
      <Brand />
      <Reviews />
      <BlogSection />
    </div>
  )
}
