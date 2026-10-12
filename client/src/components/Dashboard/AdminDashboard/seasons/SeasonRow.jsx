"use client";
import { ChevronDown, ChevronRight, MoreVertical, Flag, Moon, Sun, ShieldCheck, Sprout, GraduationCap, Tag, Percent, Plus } from "lucide-react";
import { Link } from "@/lib/i18n/routing";
import { formatDate } from "@/components/Dashboard/AdminDashboard/shared/formatDate";
import { getSeasonStatusLabel } from "./seasonsData";

const iconMap = {
  flag: Flag,
  moon: Moon,
  sun: Sun,
  shield: ShieldCheck,
  leaf: Sprout,
  graduation: GraduationCap,
};

function StatusBadge({ season }) {
  const label = getSeasonStatusLabel(season);
  const style =
    season.status === "active" && season.timing === "current"
      ? "bg-[var(--color-green)] text-white"
      : season.status === "active"
      ? "bg-[var(--color-gold-light)] text-[var(--color-green-dark)]"
      : "bg-[var(--color-sand)] text-[var(--color-soft)]";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${style}`}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {label}
    </span>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div className="min-w-0">
      <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-muted)]">{label}</p>
      <div className="mt-1 text-[12px] font-medium text-[var(--color-ink)]">{children}</div>
    </div>
  );
}

export default function SeasonRow({ season, isExpanded, onToggle }) {
  const Icon = iconMap[season.icon] || Flag;
  const hiddenOffers = Math.max(0, season.offersCount - season.offers.length);

  return (
    <>
      <div className="grid grid-cols-[minmax(260px,1.7fr)_110px_110px_110px_90px_150px_45px] items-center gap-3 border-b border-[var(--color-divider)] px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            aria-label={isExpanded ? "Collapse season" : "Expand season"}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--color-soft)] hover:bg-[var(--color-sand)]"
          >
            {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>

          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-sand)] text-[var(--color-soft)]">
            <Icon size={18} />
          </span>

          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[var(--color-ink)]">{season.nameEn}</p>
            <p dir="rtl" className="mt-1 truncate text-left text-[9px] text-[var(--color-muted)]">{season.nameAr}</p>
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-sand)] px-2 py-1 text-[9px] font-bold text-[var(--color-green-dark)]">
            <Tag size={10} />
            {season.offersCount} Offers
          </span>
        </div>

        <div className="text-[11px] text-[var(--color-soft)]">{formatDate(season.startDate)}</div>
        <div className="text-[11px] text-[var(--color-soft)]">{formatDate(season.endDate)}</div>
        <div className="text-[11px] text-[var(--color-soft)]">{season.durationDays} days</div>

        <div>
          <StatusBadge season={season} />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            aria-label="Season actions"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-soft)] hover:bg-[var(--color-sand)]"
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="border-b border-[var(--color-divider)] bg-[var(--color-cream)] px-5 py-4">
          <div className="grid grid-cols-1 gap-4 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoBlock label="Bilingual Name">
              <p>{season.nameEn}</p>
              <p dir="rtl" className="mt-0.5 text-left text-[11px] text-[var(--color-muted)]">{season.nameAr}</p>
            </InfoBlock>

            <InfoBlock label="Validity Period">
              <p>{formatDate(season.startDate)} – {formatDate(season.endDate)}</p>
              <p className="mt-0.5 text-[11px] text-[var(--color-gold)]">{season.durationDays} Days</p>
            </InfoBlock>

            <InfoBlock label="Campaign Status">{getSeasonStatusLabel(season)}</InfoBlock>

            <InfoBlock label="Description">
              <p className="line-clamp-2 text-[11px] font-normal text-[var(--color-soft-2)]">{season.description}</p>
            </InfoBlock>
          </div>

          {season.offers.length > 0 ? (
            <div className="mt-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-ink)]">
                  <Percent size={13} />
                  Associated Offers ({season.offersCount} Total)
                </p>

                <button type="button" className="flex items-center gap-1 rounded-lg bg-[var(--color-gold)] px-3 py-1.5 text-[10px] font-bold text-[var(--color-green-dark)] hover:bg-[var(--color-gold-light)]">
                  <Plus size={12} /> Add Offer to Season
                </button>
              </div>

              <div className="space-y-2">
                {season.offers.map((offer) => (
                  <div key={offer._id} className="flex items-center gap-3 rounded-[10px] border border-[var(--color-divider)] bg-[var(--color-cream)] px-3 py-2.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-sand)] text-[var(--color-muted)]">
                      <Tag size={15} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12px] font-semibold text-[var(--color-ink)]">{offer.name}</p>
                      <p className="truncate text-[10px] text-[var(--color-muted)]">{offer.target}</p>
                    </div>

                    <span className="shrink-0 rounded bg-[var(--color-gold-light)] px-2 py-1 text-[9px] font-bold text-[var(--color-green-dark)]">
                      {offer.discount}
                    </span>
                    <span className="shrink-0 text-[10px] text-[var(--color-soft)]">{offer.status}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                <p className="italic text-[var(--color-muted)]">
                  {hiddenOffers > 0 ? `+${hiddenOffers} more offers currently associated with this season` : ""}
                </p>
                <Link href="/offers" className="font-semibold text-[var(--color-green)]">
                  View all in Offers Console →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex flex-col items-center justify-center rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-10 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-sand)]">
                <Tag size={20} className="text-[var(--color-soft)]" />
              </div>

              <h3 className="mt-3 text-[13px] font-semibold text-[var(--color-ink)]">
                No offers assigned to this season yet.
              </h3>
              <p className="mt-1 max-w-[420px] text-[10px] leading-5 text-[var(--color-muted)]">
                Assign discounts or promotions to activate seasonal marketing widgets for storefront visitors.
              </p>

              <button type="button" className="mt-4 flex items-center gap-1 rounded-lg bg-[var(--color-gold)] px-4 py-2 text-[10px] font-bold text-[var(--color-green-dark)] hover:bg-[var(--color-gold-light)]">
                <Plus size={12} /> Add Offer to Season
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}