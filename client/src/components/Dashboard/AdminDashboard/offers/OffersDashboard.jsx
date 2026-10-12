import { OffersHeader, OffersStats, OffersInteractive } from "@/index";
import { offerStats, offersData } from "./offersData";

export default function OffersDashboard() {
  return (
    <div className="min-w-0 bg-[var(--color-cream)] text-[var(--color-ink)]">
      <div className="mx-auto w-full max-w-[1120px] py-5 lg:py-3">
        <OffersHeader />
        <OffersStats stats={offerStats} />
        <OffersInteractive offers={offersData} />
      </div>
    </div>
  );
}