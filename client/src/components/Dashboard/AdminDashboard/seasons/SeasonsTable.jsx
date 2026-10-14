"use client";
import { useMemo, useState } from "react";
import { SeasonRow, TablePagination } from "@/index";
import { seasonGridCols, seasonTableMinWidth } from "./seasonsData";

export default function SeasonsTable({ seasons }) {
  const [openSeasons, setOpenSeasons] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);

  const totalPages = Math.max(1, Math.ceil(seasons.length / rowsPerPage));
  const safePage = Math.min(page, totalPages);

  const visibleSeasons = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return seasons.slice(start, start + rowsPerPage);
  }, [seasons, safePage, rowsPerPage]);

  const toggleSeason = (id) => {
    setOpenSeasons((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className={`${seasonTableMinWidth} w-full`}>
          <div className={`grid ${seasonGridCols} gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]`}>
            <span>Season</span>
            <span>Offers</span>
            <span>Start Date</span>
            <span>End Date</span>
            <span>Duration</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          {visibleSeasons.length > 0 ? (
            visibleSeasons.map((season) => (
              <SeasonRow
                key={season._id}
                season={season}
                isExpanded={openSeasons.includes(season._id)}
                onToggle={() => toggleSeason(season._id)}
              />
            ))
          ) : (
            <div className="flex min-h-[180px] items-center justify-center text-[12px] text-[var(--color-muted)]">
              No seasons found.
            </div>
          )}
        </div>
      </div>

      <TablePagination
        page={safePage}
        totalPages={totalPages}
        total={seasons.length}
        rowsPerPage={rowsPerPage}
        onPageChange={setPage}
        onRowsChange={(value) => {
          setRowsPerPage(value);
          setPage(1);
        }}
        noun="seasons"
      />
    </section>
  );
}