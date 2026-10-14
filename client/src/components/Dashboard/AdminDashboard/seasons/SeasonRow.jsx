"use client";
import { useEffect } from "react";
import { ChevronDown, ChevronRight, Sun, Tag, Percent, Loader2 } from "lucide-react";
import { useLocale } from "next-intl";
import { Link } from "@/lib/i18n/routing";
import { formatDate, daysBetween } from "@/components/Dashboard/AdminDashboard/shared/formatDate";
import { getToggleState } from "@/components/Dashboard/AdminDashboard/shared/periodUtils";
import { AdminEditButton, AdminArchiveButton } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import { seasonGridCols } from "./seasonsData";

const statusStyles = {
  Active: "bg-[var(--color-green)] text-white",
  Scheduled: "bg-[var(--color-gold-light)] text-[var(--color-green-dark)]",
  Expired: "bg-[var(--color-sand)] text-[var(--color-soft)]",
  Inactive: "bg-[var(--color-sand)] text-[var(--color-muted)]",
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${statusStyles[status] || statusStyles.Inactive}`}>
      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
      {status}
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

function formatOfferDiscount(offer) {
  return offer.type === "percentage"
    ? `${offer.discount}% OFF`
    : `SAR ${Number(offer.discount).toFixed(2)} OFF`;
}

function getOfferTarget(offer, locale) {
  if (offer.targetType === "product") {
    const title = offer.product?.title;
    return `Product: ${title?.[locale] || title?.en || title?.ar || "—"}`;
  }

  const name = offer.category?.name;
  return `Category: ${name?.[locale] || name?.en || name?.ar || "—"}`;
}

export default function SeasonRow({ season, isExpanded, onToggle, offersData, onLoadOffers, onLoadMoreOffers  }) {
  const locale = useLocale();
  const { openEditSeason, toggleSeasonActive } = useAdminContext();

  const offers = offersData?.offers || [];
  const offersLoading = offersData?.loading || false;
  const hasMore = (offersData?.page || 1) < (offersData?.totalPages || 1);
  const remaining = Math.max(0, (offersData?.total || 0) - offers.length);

  const offersCount = season.offersCount || 0;
  const durationDays = daysBetween(season.startDate, season.endDate);
  const toggle = getToggleState(season, "season");
  const seasonName = season.name?.en || season.name?.ar || "season";

  useEffect(() => {
    if (isExpanded && offersCount > 0 && !offersData) {
      onLoadOffers(season._id);
    }
  }, [isExpanded, offersCount, offersData, season._id, onLoadOffers]);

  return (
    <>
      <div className={`grid ${seasonGridCols} items-center gap-3 border-b border-[var(--color-divider)] px-4 py-3`}>
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
            <Sun size={18} />
          </span>

          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[var(--color-ink)]">{season.name?.en}</p>
            <p dir="rtl" className="mt-1 truncate text-left text-[9px] text-[var(--color-muted)]">{season.name?.ar}</p>
          </div>
        </div>

        <div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-sand)] px-2 py-1 text-[9px] font-bold text-[var(--color-green-dark)]">
            <Tag size={10} />
            {offersCount} Offers
          </span>
        </div>

        <div className="text-[11px] text-[var(--color-soft)]">{formatDate(season.startDate)}</div>
        <div className="text-[11px] text-[var(--color-soft)]">{formatDate(season.endDate)}</div>
        <div className="text-[11px] text-[var(--color-soft)]">{durationDays} days</div>

        <div>
          <StatusBadge status={season.status} />
        </div>

        <div className="flex flex-col items-center gap-1">
          <AdminArchiveButton
            name={seasonName}
            entity="season"
            isActive={season.isActive}
            disabled={toggle.disabled}
            disabledReason={toggle.reason}
            onClick={() => toggleSeasonActive(season._id, !season.isActive)}
          />
          
          <AdminEditButton name={seasonName} onClick={() => openEditSeason(season)} />
        </div>
      </div>

      {isExpanded && (
        <div className="border-b border-[var(--color-divider)] bg-[var(--color-cream)] px-5 py-4">
          <div className="grid grid-cols-1 gap-4 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoBlock label="Bilingual Name">
              <p>{season.name?.en}</p>
              <p dir="rtl" className="mt-0.5 text-left text-[11px] text-[var(--color-muted)]">{season.name?.ar}</p>
            </InfoBlock>

            <InfoBlock label="Validity Period">
              <p>{formatDate(season.startDate)} – {formatDate(season.endDate)}</p>
              <p className="mt-0.5 text-[11px] text-[var(--color-gold)]">{durationDays} Days</p>
            </InfoBlock>

            <InfoBlock label="Campaign Status">{season.status}</InfoBlock>

            <InfoBlock label="Description">
              <p className="line-clamp-2 text-[11px] font-normal text-[var(--color-soft-2)]">
                {season.description?.[locale] || season.description?.en || "—"}
              </p>
            </InfoBlock>
          </div>

          {offersCount > 0 ? (
            <div className="mt-3 rounded-[12px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--color-ink)]">
                  <Percent size={13} />
                  Associated Offers ({offersCount} Total)
                </p>
              </div>

              {!offersData || (offersLoading && offers.length === 0) ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 size={20} className="animate-spin text-[var(--color-soft)]" />
                </div>
              ) : (
                <div className="space-y-2">
                  {offers.map((offer) => (
                    <div key={offer._id} className="flex items-center gap-3 rounded-[10px] border border-[var(--color-divider)] bg-[var(--color-cream)] px-3 py-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-sand)] text-[var(--color-muted)]">
                        <Tag size={15} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[12px] font-semibold text-[var(--color-ink)]">
                          {offer.name?.[locale] || offer.name?.en}
                        </p>
                        <p className="truncate text-[10px] text-[var(--color-muted)]">{getOfferTarget(offer, locale)}</p>
                      </div>

                      <span className="shrink-0 rounded bg-[var(--color-gold-light)] px-2 py-1 text-[9px] font-bold text-[var(--color-green-dark)]">
                        {formatOfferDiscount(offer)}
                      </span>
                      <span className="shrink-0 text-[10px] text-[var(--color-soft)]">{offer.status}</span>
                    </div>
                  ))}
                </div>
              )}

              {hasMore && (
                <div className="mt-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => onLoadMoreOffers(season._id)}
                    disabled={offersLoading}
                    className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-[10px] font-semibold text-[var(--color-green-dark)] hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {offersLoading && <Loader2 size={13} className="animate-spin" />}
                    {offersLoading ? "Loading..." : `Load More Offers (${remaining} left)`}
                  </button>
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-end gap-2 text-[10px]">
                <Link href="/products" className="font-semibold text-[var(--color-green)]">
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
            </div>
          )}
        </div>
      )}
    </>
  );
}