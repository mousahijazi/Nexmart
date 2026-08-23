"use client";
import { Search } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { getJSONCategories } from "@/helper/fetchApi";
import { SmoothNavLink } from "@/index";

export default function NavSearch() {
    const t = useTranslations();
    const locale = useLocale();
    const [search, setSearch] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading ,setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
          try {
              const result = await getJSONCategories();
              setCategories(result || []);
          } catch (error) {
            console.error("Failed to fetch categories:", error);
            setCategories([]);
          } finally {
            setLoading(false);
          }
        };

        fetchCategories();
    }, [])

     const results =
        search.trim().length > 0
            ? categories.filter((category) => category?.name_en?.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 6)
            : [];

    return (
        <div className="relative flex-1 min-w-[200px]">
            <div className="flex items-center gap-[10px] bg-surface border border-[var(--color-field)] rounded-xl px-[14px] py-[10px] focus-within:border-green">
                <span className="text-gray-600 text-[15px]">
                    <Search size={18} />
                </span>

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("header.search.placeholder")}
                  className="border-0 bg-transparent outline-none text-sm w-full text-gray-600 dark:text-[var(--color-ink)]"
                />

                <span
                    className={`text-xs text-gray-600 ${
                        locale === "ar"
                            ? "border-r pr-3"
                            : "border-l pl-3"
                    } border-[#DCDAD0] whitespace-nowrap cursor-pointer hover:text-[var(--color-gold)] transition duration-300`}
                >
                    {t("header.search.title")}
                </span>

            </div>

            {search.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[var(--color-surface)] border border-[var(--color-field)] rounded-xl shadow-lg overflow-hidden">
                    {results.length > 0 ? (
                        results.map((ele, index) => (
                          <SmoothNavLink key={index} href={`/products?category=${ele.slug}#products`} targetId="FlashDeals">
                            <div className="w-full text-start px-4 py-3 hover:bg-[#E9E7DD] dark:hover:bg-[var(--color-field)] transition">
                              <span className="text-sm font-semibold text-[var(--color-ink)]">
                                {ele.name_en}
                              </span>
                            </div>
                          </SmoothNavLink>
                        ))
                    ) : (
                        <div className="px-4 py-4 text-sm text-gray-500">
                          لا يوجد بيانات بنفس هذا الاسم
                        </div>
                    )}

                </div>
            )}

        </div>
    );
}