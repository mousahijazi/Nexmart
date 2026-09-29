"use client";
import { useCallback, useEffect, useState } from "react";
import { getBrand, getBrandProducts } from "@/helper/fetchApi";

export default function useAdminBrands() {
  const [brandProducts, setBrandProducts] = useState({});

  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsPage, setBrandsPage] = useState(1);
  const [brandsLimit, setBrandsLimit] = useState(10);
  const [brandsTotal, setBrandsTotal] = useState(0);
  const [brandsTotalPages, setBrandsTotalPages] = useState(0);

  const fetchBrands = useCallback(async (page, limit) => {
    setBrandsLoading(true);

    try {
      const result = await getBrand(limit, page);

      setBrands(result.brands);
      setBrandsTotal(result.total);
      setBrandsTotalPages(result.totalPages);
    } finally {
      setBrandsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands(brandsPage, brandsLimit);
  }, [brandsPage, brandsLimit, fetchBrands]);

  const fetchBrandProducts = useCallback(
    async (brandId, brandSlug, page = 1, limit = 10) => {
      const token = localStorage.getItem("nexmart-token");

      setBrandProducts((current) => ({
        ...current,
        [brandId]: {
          ...(current[brandId] || {}),
          loading: true,
        },
      }));

      try {
        const result = await getBrandProducts(brandSlug, limit, page, token);

        setBrandProducts((current) => ({
          ...current,
          [brandId]: {
            products: result.products,
            loading: false,
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages,
          },
        }));
      } catch (error) {
        setBrandProducts((current) => ({
          ...current,
          [brandId]: {
            ...(current[brandId] || {}),
            loading: false,
          },
        }));
      }
    },
    []
  );

  return {
    brands,
    brandsLoading,
    brandsPage,
    setBrandsPage,
    brandsLimit,
    setBrandsLimit,
    brandsTotal,
    brandsTotalPages,

    brandProducts,
    fetchBrandProducts,
  };
}