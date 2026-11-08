"use client";
import { OffersFilters, OffersTable } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import { useLocale, useTranslations } from "next-intl";
import OffersTableSkeleton from "./OffersTableSkeleton";

export default function OffersInteractive() {
  const locale = useLocale();
  const t = useTranslations("Admin.offers");

  const {
    offers,
    offersLoading,

    offersPage,
    setOffersPage,
    offersLimit,
    setOffersLimit,
    offersTotal,
    offersTotalPages,


    search,
    setSearch,
    status,
    setStatus,
    target,
    setTarget,
    season,
    setSeason,
    resetOfferFilters,

    seasons,
  } = useAdminContext();

  const seasonOptions = [
    { label: t("filters.allSeasons"), value: "all" },
    ...(seasons || []).map((item) => ({
      label: item.name?.[locale] || item.name?.en || item.name?.ar || t("filters.unnamedSeason"),
      value: item._id,
    })),
  ];

  return (
    <>
      <OffersFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        target={target}
        setTarget={setTarget}
        season={season}
        setSeason={setSeason}
        seasonOptions={seasonOptions}
        onReset={resetOfferFilters}
      />

      {offersLoading ? (
        <OffersTableSkeleton />
      ) : (
        <OffersTable
          offers={offers}
          page={offersPage}
          setPage={setOffersPage}
          limit={offersLimit}
          setLimit={setOffersLimit}
          total={offersTotal}
          totalPages={offersTotalPages}
        />
      )}
    </>
  );
}