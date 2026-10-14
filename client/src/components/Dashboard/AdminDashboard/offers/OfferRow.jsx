"use client";
import Image from "next/image";
import { ChevronDown, ChevronRight, MoreVertical, Package, LayoutGrid, Flag, Pencil, LineChart } from "lucide-react";
import { getImageUrl } from "@/helper/getImage";
import { formatDate } from "@/components/Dashboard/AdminDashboard/shared/formatDate";
import { formatDiscount } from "./offersData";
import { useLocale } from "next-intl";
import { useAdminContext } from "@/Context/Adminprovider";
import { AdminEditButton } from "@/index";
import { offerGridCols } from "./offersData";

const statusStyles = {
  Active: "bg-[var(--color-green)] text-white",
  Scheduled: "bg-[var(--color-gold-light)] text-[var(--color-green-dark)]",
  Expired: "bg-[var(--color-sand)] text-[var(--color-soft)]",
  Inactive: "bg-[var(--color-sand)] text-[var(--color-muted)]",
};

function InfoBox({ label, value }) {
  return (
    <div className="min-w-0 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5">
      <p className="text-[10px] font-medium text-[var(--color-muted)]">{label}</p>
      <p className="mt-0.5 truncate text-[12px] font-medium text-[var(--color-ink)]">{value}</p>
    </div>
  );
}

export default function OfferRow({ offer, isExpanded, onToggle }) {
  const locale = useLocale();
  const { openEditOffer } = useAdminContext();
  const TargetIcon = offer.targetType === "product" ? Package : LayoutGrid;
  const discountText = formatDiscount(offer.discount, offer.type);
  const targetImage = offer.targetType === "product" ? offer.product?.mainImage : offer.category?.image;
  const targetName = offer.targetType === "product" ? offer.product?.title?.[locale] : offer.category?.name?.[locale];

  return (
    <>
      <div className={`grid ${offerGridCols} items-center gap-3 border-b border-[var(--color-divider)] px-4 py-3`}>
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onToggle}
            aria-label={isExpanded ? "Collapse offer" : "Expand offer"}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[var(--color-soft)] hover:bg-[var(--color-sand)]"
          >
            {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>

          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold text-[var(--color-ink)]">{offer?.name?.[locale]}</p>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--color-sand)] text-[var(--color-muted)]">
            {targetImage ? (
              <Image src={getImageUrl(targetImage)} alt={targetName} fill sizes="40px" className="object-cover" />
            ) : (
              <TargetIcon size={18} />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-[12px] font-medium text-[var(--color-ink)]">{targetName}</p>
            <span className="mt-1 inline-block rounded bg-[var(--color-sand)] px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]">
              {offer.targetType}
            </span>
          </div>
        </div>

        <div>
          <span className="inline-block rounded-lg bg-[var(--color-gold-light)] px-2.5 py-1.5 text-[11px] font-bold text-[var(--color-green-dark)]">
            {discountText}
          </span>
        </div>

        <div className="min-w-0">
          <span className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-sand)] px-2.5 py-1 text-[10px] font-medium text-[var(--color-soft)]">
            <Flag size={11} className="shrink-0" />
            <span className="truncate">{offer.season?.name?.[locale]}</span>
          </span>
        </div>

        <div className="text-[11px] leading-[1.4] text-[var(--color-soft)]">
          <p className="text-[var(--color-ink)]">{formatDate(offer.startDate)}</p>
          <p>to {formatDate(offer.endDate)}</p>
        </div>

        <div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold ${statusStyles[offer.status]}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {offer.status}
          </span>
        </div>

        <div className="flex items-center justify-end gap-1 pl-5">
          <AdminEditButton name={offer?.name?.en || offer?.name?.ar || "offer"} onClick={() => openEditOffer(offer)} />
        </div>
      </div>

      {isExpanded && (
        <div className="border-b border-[var(--color-divider)] bg-[var(--color-cream)] px-5 py-4">
          <div className="rounded-[12px] border border-[var(--color-border)] bg-[var(--color-cream)] p-4">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]">
                Offer Campaign Specifications
              </p>
            </div>

            <p className="mt-3 text-[12px] leading-[1.6] text-[var(--color-soft-2)]">{offer.description?.[locale]}</p>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <InfoBox label="Target Type & Name" value={`${offer.targetType}: ${targetName}`} />
              <InfoBox label="Discount Mode" value={`${offer.type === "percentage" ? "Percentage" : "Fixed"}: ${discountText}`} />
              <InfoBox label="Validity Window" value={`${formatDate(offer.startDate)} – ${formatDate(offer.endDate)}`} />
              <InfoBox label="Affiliated Season" value={offer.season?.name?.[locale]} />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-divider)] pt-4">
              <div className="flex flex-wrap items-center gap-2">
                <button type="button" className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[11px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-sand)]">
                  <Pencil size={13} /> Edit Rules
                </button>
                <button type="button" className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[11px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-sand)]">
                  <LineChart size={13} /> View Conversion SLA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}