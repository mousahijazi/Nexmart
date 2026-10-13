import { SeasonsHeader, SeasonsStats, SeasonsInteractive } from "@/index";
import { seasonStats } from "./seasonsData";

export default function SeasonsDashboard() {
  return (
    <div className="min-w-0 bg-[var(--color-cream)] text-[var(--color-ink)]">
      <div className="mx-auto w-full max-w-[1120px] py-5 lg:py-3">
        <SeasonsHeader />
        <SeasonsStats stats={seasonStats} />
        <SeasonsInteractive />
      </div>
    </div>
  );
}