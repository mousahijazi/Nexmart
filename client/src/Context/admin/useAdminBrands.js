"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getBrand, getBrandProducts, createBrand, updateBrand, updateBrandStatus } from "@/helper/fetchApi";

export default function useAdminBrands({ showAlert, enabled }) {
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [brandProducts, setBrandProducts] = useState({});

  const [brandsPage, setBrandsPage] = useState(1);
  const [brandsLimit, setBrandsLimit] = useState(10);
  const [brandsTotal, setBrandsTotal] = useState(0);
  const [brandsTotalPages, setBrandsTotalPages] = useState(0);

  const [brandsSearch, setBrandsSearchState] = useState("");
  const [brandsStatus, setBrandsStatusState] = useState("all");

  const updateBrandsSearch = useCallback((value) => {
    setBrandsSearchState(value);
    setBrandsPage(1);
  }, []);

  const updateBrandsStatus = useCallback((value) => {
    setBrandsStatusState(value);
    setBrandsPage(1);
  }, []);

  const [debouncedSearch, setDebouncedSearch] = useState("");

  const brandsRequestId = useRef(0);

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [brandModalMode, setBrandModalMode] = useState("create");
  const [editingBrand, setEditingBrand] = useState(null);

  const openBrandModal = useCallback(() => {
    setBrandModalMode("create");
    setEditingBrand(null);
    setIsBrandModalOpen(true);
  }, []);

  const openEditBrand = useCallback((brand) => {
    setBrandModalMode("edit");
    setEditingBrand(brand);
    setIsBrandModalOpen(true);
  }, []);

  const closeBrandModal = useCallback(() => {
    setIsBrandModalOpen(false);
    setEditingBrand(null);
    setBrandModalMode("create");
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(brandsSearch.trim());
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [brandsSearch]);

  const fetchBrands = useCallback(async (page = 1, limit = 10, filters = {}) => {
    const requestId = ++brandsRequestId.current;

    setBrandsLoading(true);

    try {
      const token = localStorage.getItem("nexmart-token");

      const result = await getBrand(limit, page, token, { search: filters.search ?? "", status: filters.status ?? "all" });

      if (requestId !== brandsRequestId.current) {
        return result;
      }

      setBrands(result.brands || []);
      setBrandsTotal(result.total || 0);
      setBrandsTotalPages(result.totalPages || 0);

      return result;
    } catch (error) {
      console.error("fetchBrands:", error);

      if (requestId === brandsRequestId.current) {
        setBrands([]);
        setBrandsTotal(0);
        setBrandsTotalPages(0);
      }

      return {
        brands: [],
        total: 0,
        totalPages: 0,
        page,
        limit,
      };
    } finally {
      if (requestId === brandsRequestId.current) {
        setBrandsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    fetchBrands(brandsPage, brandsLimit, { search: debouncedSearch, status: brandsStatus });

    return () => {
      brandsRequestId.current += 1;
    };
  }, [enabled, brandsPage, brandsLimit, debouncedSearch, brandsStatus, fetchBrands]);

  const refreshBrands = useCallback(() => {
    return fetchBrands(brandsPage, brandsLimit, { search: debouncedSearch, status: brandsStatus });
  }, [fetchBrands, brandsPage, brandsLimit, debouncedSearch, brandsStatus]);

  const addBrand = useCallback(async (formData) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await createBrand(formData, token);

    if (!result.success) {
      return result;
    }

    closeBrandModal();

    if (brandsPage === 1) {
      await fetchBrands(1, brandsLimit, { search: debouncedSearch, status: brandsStatus });
    } else {
      setBrandsPage(1);
    }

    return result;
  }, [showAlert, closeBrandModal, brandsPage, brandsLimit, debouncedSearch, brandsStatus, fetchBrands]);

  const editBrand = useCallback(async (brandId, formData) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await updateBrand(brandId, formData, token);

    if (!result.success) {
      return result;
    }

    closeBrandModal();

    await refreshBrands();

    return result;
  }, [showAlert, closeBrandModal, refreshBrands]);

  const toggleBrandActive = useCallback(async (brandId, isActive) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await updateBrandStatus(brandId, isActive, token);

    if (!result.success) {
      showAlert(result.message, "danger");
      return result;
    }

    const refreshedResult = await refreshBrands();

    if (refreshedResult?.brands?.length === 0 && brandsPage > 1) {
      setBrandsPage((current) => Math.max(1, current - 1));
    }

    setBrandProducts((current) => {
      const updated = { ...current };
      delete updated[brandId];
      return updated;
    });

    showAlert(isActive ? "Brand restored successfully!" : "Brand archived successfully!", "success");

    return result;
  }, [showAlert, refreshBrands, brandsPage]);
  
  const fetchBrandProducts = useCallback(async (brandId, brandSlug, page = 1, limit = 10) => {
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
          products: result.products || [],
          loading: false,
          page: result.page || page,
          limit: result.limit || limit,
          total: result.total || 0,
          totalPages: result.totalPages || 0,
        },
      }));

      return result;
    } catch (error) {
      console.error("fetchBrandProducts:", error);

      setBrandProducts((current) => ({
        ...current,
        [brandId]: {
          ...(current[brandId] || {}),
          loading: false,
        },
      }));

      return { products: [] };
    }
  }, []);

  const loadMoreBrandProducts = useCallback(async (brandId, brandSlug) => {
    const currentBrand = brandProducts[brandId];

    if (!currentBrand) return;
    if (currentBrand.loading) return;

    if (currentBrand.page >= currentBrand.totalPages) {
      return;
    }

    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const nextPage = currentBrand.page + 1;

    setBrandProducts((current) => ({
      ...current,
      [brandId]: {
        ...current[brandId],
        loading: true,
      },
    }));

    try {
      const result = await getBrandProducts(brandSlug, currentBrand.limit || 10, nextPage, token);

      setBrandProducts((current) => ({
        ...current,
        [brandId]: {
          ...current[brandId],
          products: [
            ...(current[brandId]?.products || []),
            ...(result.products || []),
          ],
          loading: false,
          page: result.page || nextPage,
          limit: result.limit || currentBrand.limit || 10,
          total: result.total || 0,
          totalPages: result.totalPages || 0,
        },
      }));

      return result;
    } catch (error) {
      console.error("loadMoreBrandProducts:", error);

      setBrandProducts((current) => ({
        ...current,
        [brandId]: {
          ...current[brandId],
          loading: false,
        },
      }));

      return { success: false };
    }
  }, [brandProducts, showAlert]);

  return {
    brands,
    brandsLoading,
    refreshBrands,

    brandsPage,
    setBrandsPage,
    brandsLimit,
    setBrandsLimit,
    brandsTotal,
    brandsTotalPages,

    brandsSearch,
    setBrandsSearch: updateBrandsSearch,

    brandsStatus,
    setBrandsStatus: updateBrandsStatus,

    brandProducts,
    fetchBrandProducts,
    loadMoreBrandProducts,

    isBrandModalOpen,
    brandModalMode,
    editingBrand,
    openBrandModal,
    openEditBrand,
    closeBrandModal,

    addBrand,
    editBrand,
    toggleBrandActive,
  };
}