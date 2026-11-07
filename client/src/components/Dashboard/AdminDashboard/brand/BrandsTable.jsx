"use client";
import { useState } from "react";
import { BrandRow } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import { BrandsPagination } from "@/index";

export default function BrandsTable({ brands }) {
  const [openBrands, setOpenBrands] = useState([]);
  const { brandProducts, fetchBrandProducts, loadMoreBrandProducts,  brandsPage, setBrandsPage, brandsLimit, setBrandsLimit, brandsTotal, brandsTotalPages } = useAdminContext();

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

  const getPageNumbers = () => {
    const totalPages = brandsTotalPages;
    const maxVisiblePages = 5;

    const startPage = Math.max(1, Math.min(brandsPage - 2, totalPages - maxVisiblePages + 1));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    return Array.from(
      { length: Math.max(0, endPage - startPage + 1) },
      (_, index) => startPage + index
    );
  };

  const pageNumbers = getPageNumbers();


  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className="min-w-[780px] w-full">
          <div className="grid grid-cols-[minmax(260px,1.7fr)_minmax(150px,1fr)_100px_110px_70px] gap-3 bg-[var(--color-sand)] px-4 py-3 text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--color-soft)]">
            <span>Brand</span>
            <span>Slug</span>
            <span>Products</span>
            <span>Status</span>
            <span>Actions</span>
          </div>

          <div>
            {brands.length > 0 ? (
              brands.map((brand) => (
                <BrandRow
                  key={brand._id}
                  brand={brand}
                  isExpanded={openBrands.includes(brand._id)}
                  productsData={brandProducts[brand._id]}
                  onLoadMore={() => loadMoreBrandProducts(brand._id, brand.slug)}
                  onToggle={() => toggleBrand(brand)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                <p className="text-[13px] font-semibold text-[var(--color-ink)]">
                  No brands found
                </p>

                <p className="mt-2 text-[11px] text-[var(--color-muted)]">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div> 

      <BrandsPagination pageNumbers={pageNumbers} brandsPage={brandsPage} setBrandsPage={setBrandsPage} brandsLimit={brandsLimit} setBrandsLimit={setBrandsLimit} brandsTotal={brandsTotal} brandsTotalPages={brandsTotalPages} />
    </section>
  );
}