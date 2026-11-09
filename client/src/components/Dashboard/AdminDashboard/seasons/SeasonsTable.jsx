"use client";
import { useState } from "react";
import { SeasonRow, TablePagination } from "@/index";
import { seasonGridCols, seasonTableMinWidth } from "./seasonsData";
import { useAdminContext } from "@/Context/Adminprovider";
import { useTranslations } from "next-intl";

export default function SeasonsTable({ seasons }) {
  const t = useTranslations("Admin.seasons");
  const { seasonOffers, fetchSeasonOffers, loadMoreSeasonOffers, seasonsPage, setSeasonsPage, seasonsLimit, setSeasonsLimit, seasonsTotal, seasonsTotalPages } = useAdminContext();

  const [openSeasons, setOpenSeasons] = useState([]);

  const toggleSeason = (id) => {
    setOpenSeasons((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className={`${seasonTableMinWidth} w-full`}>
          <div className={`grid ${seasonGridCols} gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]`}>
            <span>{t("table.season")}</span>
            <span>{t("table.offers")}</span>
            <span>{t("table.startDate")}</span>
            <span>{t("table.endDate")}</span>
            <span>{t("table.duration")}</span>
            <span>{t("table.status")}</span>
            <span>{t("table.actions")}</span>
          </div>

          {seasons?.length > 0 ? (
            seasons.map((season) => (
              <SeasonRow
                key={season._id}
                season={season}
                isExpanded={openSeasons.includes(season._id)}
                onToggle={() => toggleSeason(season._id)}
                offersData={seasonOffers[season._id]}
                onLoadOffers={fetchSeasonOffers}
                onLoadMoreOffers={loadMoreSeasonOffers}
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
        page={seasonsPage}
        totalPages={seasonsTotalPages}
        total={seasonsTotal}
        rowsPerPage={seasonsLimit}
        onPageChange={setSeasonsPage}
        onRowsChange={setSeasonsLimit}
        noun={t("table.paginationNoun")}
      />
    </section>
  );
}