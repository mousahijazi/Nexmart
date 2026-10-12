"use client";
import { useMemo, useState } from "react";
import { OfferRow, TablePagination } from "@/index";

export default function OffersTable({ offers }) {
  const [openOffers, setOpenOffers] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const totalPages = Math.max(1, Math.ceil(offers.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);

  const visibleOffers = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return offers.slice(start, start + rowsPerPage);
  }, [offers, safePage, rowsPerPage]);

  const toggleOffer = (id) => {
    setOpenOffers((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className="min-w-[1050px] w-full">
          <div className="grid grid-cols-[minmax(240px,1.6fr)_minmax(200px,1.3fr)_110px_170px_130px_100px_45px] gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]">
            <span>Offer Name &amp; Code</span>
            <span>Target</span>
            <span>Discount</span>
            <span>Season</span>
            <span>Validity Period</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {visibleOffers.length > 0 ? (
            visibleOffers.map((offer) => (
              <OfferRow
                key={offer._id}
                offer={offer}
                isExpanded={openOffers.includes(offer._id)}
                onToggle={() => toggleOffer(offer._id)}
              />
            ))
          ) : (
            <div className="flex min-h-[180px] items-center justify-center text-[12px] text-[var(--color-muted)]">
              No offers found.
            </div>
          )}
        </div>
      </div>

      <TablePagination
        page={safePage}
        totalPages={totalPages}
        total={offers.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsChange={(value) => {
          setRowsPerPage(value);
          setPage(1);
        }}
        noun="offers"
      />
    </section>
  );
}