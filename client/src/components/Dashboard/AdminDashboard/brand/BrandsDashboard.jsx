import { BrandsHeader, BrandsStatsGrid, BrandsInteractive } from "@/index";

export default function BrandsDashboard() {
  return (
    <div className="min-w-0 bg-[var(--color-cream)] text-[var(--color-ink)]">
      <div className="mx-auto w-full max-w-[1120px] py-5 lg:py-3">
        <BrandsHeader />
        <BrandsStatsGrid />
        <BrandsInteractive />
      </div>
    </div>
  );
}
