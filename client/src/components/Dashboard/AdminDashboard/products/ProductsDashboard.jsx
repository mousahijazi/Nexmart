"use client";
import { useMemo, useState } from "react";
import ProductStats from "./ProductStats";
import ProductFilters from "./ProductFilters";
import ProductTable from "./ProductTable";
import ProductPagination from "./ProductPagination";
import ProductsPageSkeleton from "./ProductsSkeleton";
import { Package, Download, Filter } from "lucide-react";
import { stockOptions } from "./productsData";
import { getCategoryName, getBrandName } from "./Productdisplay";
import { ProductModal, AddProductsButton } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";

export default function ProductsDashboard() {
  const {
    products,
    productsLoading,
    productsPage,
    setProductsPage,
    productsLimit,
    setProductsLimit,
    productsTotal,
    toggleProductActive,
    productsTotalPages,
  } = useAdminContext();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [brand, setBrand] = useState("All Brands");
  const [stock, setStock] = useState("All Stock Levels");

  const [selected, setSelected] = useState([]);

  const categories = useMemo(() => {
    const unique = new Set(products.map((product) => getCategoryName(product)));
    return ["All Categories", ...unique];
  }, [products]);

  const brands = useMemo(() => {
    const unique = new Set(products.map((product) => getBrandName(product)));
    return ["All Brands", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return products.filter((product) => {
      const nameEn = product.title?.en || "";
      const nameAr = product.title?.ar || "";

      const brandName = getBrandName(product);
      const categoryName = getCategoryName(product);

      const matchesSearch =
        !searchValue ||
        nameEn.toLowerCase().includes(searchValue) ||
        nameAr.toLowerCase().includes(searchValue) ||
        brandName.toLowerCase().includes(searchValue) ||
        product._id?.toLowerCase().includes(searchValue);

      const matchesCategory = category === "All Categories" || categoryName === category;
      const matchesBrand = brand === "All Brands" || brandName === brand;

      const stockStatus =
        product.stock <= 0 ? "Out of Stock" : product.stock <= 10 ? "Low Stock" : "In Stock";
      const matchesStock = stock === "All Stock Levels" || stockStatus === stock;

      return matchesSearch && matchesCategory && matchesBrand && matchesStock;
    });
  }, [products, search, category, brand, stock]);

  return (
    <div dir="ltr" className="min-w-0 bg-[var(--color-cream)] text-[var(--color-ink)]">
      <div className="mx-auto w-full max-w-[1120px] py-5 lg:py-3">
        <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-green-dark)] text-white">
              <Package />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-[23px] font-medium leading-none tracking-[-0.035em] text-[var(--color-ink)] min-[400px]:text-[25px] sm:text-[27px]">
                  Products &amp; Inventory
                </h1>

                <span className="rounded-full bg-[#F4D477] px-2 py-1 text-[8px] font-bold uppercase tracking-[0.08em] text-[#6B5010]">
                  GCC CATALOG
                </span>
              </div>

              <p className="mt-2 max-w-[650px] text-[11px] leading-[1.45] text-[var(--color-soft-2)] sm:text-[13px]">
                Manage multi-vendor catalog, bilingual SKU descriptions,
                stock levels, and regional pricing across Saudi Arabia.
              </p>
            </div>
          </div>

          <div className="flex w-full flex-row flex-wrap items-center gap-2 xl:w-auto">
            <button
              type="button"
              className="flex h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-cream)] px-4 text-[11px] font-semibold text-[var(--color-ink)]"
            >
              <Download />
              Export Catalog CSV
            </button>

            <AddProductsButton />
          </div>
        </section>

        <ProductModal />

        {productsLoading ? (
          <ProductsPageSkeleton rows={productsLimit} />
        ) : (
          <>
            <ProductStats />

            <ProductFilters
              search={search}
              setSearch={setSearch}
              category={category}
              setCategory={setCategory}
              brand={brand}
              setBrand={setBrand}
              stock={stock}
              setStock={setStock}
              categories={categories}
              brands={brands}
              stockOptions={stockOptions}
            />

            <ProductTable
              products={filteredProducts}
              selected={selected}
              onToggleActive={toggleProductActive}
            />

            <section className="md:hidden">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[var(--color-soft)]">
                  Product Catalog
                </p>

                <button
                  type="button"
                  className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--color-green)]"
                >
                  <Filter />
                  {selected.length === filteredProducts.length && filteredProducts.length > 0 ? "Clear selection" : "Select all"}
                </button>
              </div>
            </section>

            <ProductPagination
              page={productsPage}
              totalPages={productsTotalPages}
              totalCount={productsTotal}
              limit={productsLimit}
              onPageChange={setProductsPage}
              onLimitChange={setProductsLimit}
            />
          </>
        )}
      </div>
    </div>
  );
}