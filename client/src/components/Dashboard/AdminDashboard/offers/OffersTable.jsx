"use client";
import { useState } from "react";
import { OfferRow, TablePagination } from "@/index";
import { offerGridCols, offerTableMinWidth } from "./offersData";
import { useTranslations } from "next-intl";

export default function OffersTable({ offers, page, setPage, limit, setLimit, total, totalPages }) {
  const t = useTranslations("Admin.offers");
  const [openOffers, setOpenOffers] = useState([]);

  const toggleOffer = (id) => {
    setOpenOffers((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className={`${offerTableMinWidth} w-full`}>
          <div className={`grid ${offerGridCols} gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]`}>
            <span>{t("table.nameAndCode")}</span>
            <span>{t("table.target")}</span>
            <span>{t("table.discount")}</span>
            <span>{t("table.season")}</span>
            <span>{t("table.validityPeriod")}</span>
            <span>{t("table.status")}</span>
            <span>{t("table.actions")}</span>
          </div>

          {offers.length > 0 ? (
            offers.map((offer) => (
              <OfferRow
                key={offer._id}
                offer={offer}
                isExpanded={openOffers.includes(offer._id)}
                onToggle={() => toggleOffer(offer._id)}
              />
            ))
          ) : (
            <div className="flex min-h-[180px] items-center justify-center text-[12px] text-[var(--color-muted)]">
              {t("table.empty")}
            </div>
          )}
        </div>
      </div>

      <TablePagination
        page={page}
        totalPages={Math.max(1, totalPages)}
        total={total}
        rowsPerPage={limit}
        onPageChange={setPage}
        onRowsChange={setLimit}
        noun="offers"
      />
    </section>
  );
}