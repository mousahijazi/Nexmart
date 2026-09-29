"use client";
import { useCallback, useEffect, useState } from "react";
import { getBrand, getBrandProducts, createBrand, updateBrand } from "@/helper/fetchApi";

export default function useAdminBrands({ showAlert }) {
  const [brandProducts, setBrandProducts] = useState({});

  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandsPage, setBrandsPage] = useState(1);
  const [brandsLimit, setBrandsLimit] = useState(10);
  const [brandsTotal, setBrandsTotal] = useState(0);
  const [brandsTotalPages, setBrandsTotalPages] = useState(0);

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandModalMode, setBrandModalMode] = useState("create");
  const [editingBrand, setEditingBrand] = useState(null);

  const openBrandModal = () => {
    setBrandModalMode("create");
    setEditingBrand(null);
    setIsBrandModalOpen(true);
  };

  const openEditBrand = (brand) => {
    setBrandModalMode("edit");
    setEditingBrand(brand);
    setIsBrandModalOpen(true);
  };

  const closeBrandModal = () => {
    setIsBrandModalOpen(false);
    setEditingBrand(null);
    setBrandModalMode("create");
  };

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

  const addBrand = async (formData) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await createBrand(formData, token);

    if (!result.success) {
      return result;
    }

    if (brandsPage === 1) {
      fetchBrands(1, brandsLimit);
    } else {
      setBrandsPage(1);
    }

    return result;
  };

  const editBrand = async (brandId, formData) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await updateBrand(brandId, formData, token);

    if (!result.success) {
      return result;
    }

    setBrands((currentBrands) =>
      currentBrands.map((brand) =>
        brand._id === brandId
          ? result.brand
          : brand
      )
    );

    return result;
  };

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
    }, []);

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

    isBrandModalOpen,
    brandModalMode,
    editingBrand,

    openBrandModal,
    openEditBrand,
    closeBrandModal,

    addBrand,
    editBrand,
  };
}