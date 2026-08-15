"use client"
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

export default function ProductsFilter({search, setSearch}) {
  const t = useTranslations();

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex-1 min-w-[200px] flex items-center gap-[10px] bg-surface border border-[var(--color-field)] rounded-xl px-[14px] py-[10px] focus-within:border-green">
            <span className="text-[var(--color-muted)] text-[15px]"><Search size={18} /></span>
            <input 
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder={t("header.search.placeholder")} 
              className="border-0 bg-transparent outline-none text-sm w-full text-[var(--color-muted)] dark:text-[var(--color-ink)]"
            />
        </div>
    </div>
  )
}
