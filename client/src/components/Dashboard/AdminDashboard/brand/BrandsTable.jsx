"use client";
import { useMemo, useState } from "react";
import { BrandRow } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";

export default function CategoriesTable({ brands }) {
  const [openBrands, setOpenBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const { brandProducts, fetchBrandProducts, loadMoreBrandProducts } = useAdminContext();

  const totalPages = Math.max(1, Math.ceil(brands.length / rowsPerPage));

  const visibleBrands = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return brands.slice(start, start + rowsPerPage);
  }, [brands, page, rowsPerPage]);

  const toggleBrand = async (brand) => {
    const brandId = brand._id;
    const isOpen = openBrands.includes(brandId);

    setOpenBrands((current) =>
      isOpen
        ? current.filter((id) => id !== brandId)
        : [...current, brandId]
    );

    if (!isOpen && !brandProducts[brandId]) {
      await fetchBrandProducts(brandId, brand.slug, 1, 10);
    }
  };

  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className="min-w-[780px] w-full">
          <div className="grid grid-cols-[minmax(260px,1.7fr)_minmax(150px,1fr)_100px_110px_45px] gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]">
            <span>Category</span>
            <span>Parent Category</span>
            <span>Products</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div>
            {visibleBrands.map((brand) => (
              <BrandRow
                key={brand._id}
                brand={brand}
                isExpanded={openBrands.includes(brand._id)}
                productsData={brandProducts[brand._id]}
                onLoadMore={() => loadMoreBrandProducts(brand._id, brand.slug)}
                onToggle={() => toggleBrand(brand)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 border-t border-[var(--color-divider)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-[var(--color-soft)]">
          Showing {brands.length === 0 ? 0 : (page - 1) * rowsPerPage + 1} - {Math.min(page * rowsPerPage, brands.length)} of {brands.length} brands
        </p>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] text-[var(--color-soft)] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--color-sand)]"
          >
            ‹
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
            <button
              key={number}
              type="button"
              onClick={() => setPage(number)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-semibold ${
                page === number
                  ? "bg-[var(--color-green-dark)] text-white"
                  : "text-[var(--color-soft)] hover:bg-[var(--color-sand)]"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            type="button"
            disabled={page === totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] text-[var(--color-soft)] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--color-sand)]"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-[var(--color-soft)]">
          <span>Rows per page:</span>

          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[10px] outline-none"
          >
            <option value="6">6</option>
            <option value="12">12</option>
            <option value="24">24</option>
          </select>
        </div>
      </div>
    </section>
  );
}
