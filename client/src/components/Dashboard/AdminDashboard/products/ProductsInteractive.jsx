"use client";
import { useMemo } from "react";
import { useLocale } from "next-intl";
import { ProductFilters, ProductTable, ProductsPageSkeleton, ProductPagination } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";

function getLocalizedName(value, locale) {
  if (!value) return "";

  if (typeof value === "string") return value;

  return (value[locale] || value.en || value.ar || "");
}

export default function ProductsInteractive() {
  const locale = useLocale();
  const {
    products,
    productsLoading,

    productsPage,
    setProductsPage,
    productsLimit,
    setProductsLimit,
    productsTotal,
    productsTotalPages,

    productsSearch,
    setProductsSearch,
    productsCategory,
    setProductsCategory,
    productsBrand,
    setProductsBrand,
    productsStock,
    setProductsStock,
    productsStatus,
    setProductsStatus,

    toggleProductActive,

    categories,
    brands,
  } = useAdminContext();

  const categoryOptions = useMemo(() => {
    return (categories || []).map((category) => ({
        value: String(category._id),
        label: getLocalizedName(category.name, locale),
      })).filter((item) => item.value && item.label);
  }, [categories, locale]);

  const brandOptions = useMemo(() => {
    return (brands || []).map((brand) => ({
        value: String(brand._id),
        label: getLocalizedName(brand.name, locale),
      })).filter((item) => item.value && item.label);
  }, [brands, locale]);

  return (
    <>
      <ProductFilters
        search={productsSearch}
        setSearch={setProductsSearch}
        category={productsCategory}
        setCategory={setProductsCategory}
        brand={productsBrand}
        setBrand={setProductsBrand}
        stock={productsStock}
        setStock={setProductsStock}
        status={productsStatus}
        setStatus={setProductsStatus}
        categories={categoryOptions}
        brands={brandOptions}
      />

      {productsLoading ? (
          <ProductsPageSkeleton rows={productsLimit} />
          ) : (
          <>
            <ProductTable
                products={products}
                onToggleActive={toggleProductActive}
            />

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
    </>
  );
}