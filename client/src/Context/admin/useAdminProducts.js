"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts, updateProductStatus } from "@/helper/fetchApi";

const PRODUCTS_DEFAULT_LIMIT = 5;

const DEFAULT_FILTERS = {
  search: "",
  category: "all",
  brand: "all",
  stock: "all",
  status: "all",
};

export default function useAdminProducts({ showAlert, enabled }) {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  const [productsPage, setProductsPageState] = useState(1);
  const [productsLimit, setProductsLimitState] = useState(PRODUCTS_DEFAULT_LIMIT);

  const [productsTotal, setProductsTotal] = useState(0);
  const [productsTotalPages, setProductsTotalPages] = useState(0);

  const [productsSearch, setProductsSearchState] = useState(DEFAULT_FILTERS.search);
  const [productsCategory, setProductsCategoryState] = useState(DEFAULT_FILTERS.category);
  const [productsBrand, setProductsBrandState] = useState(DEFAULT_FILTERS.brand);
  const [productsStock, setProductsStockState] = useState(DEFAULT_FILTERS.stock);
  const [productsStatus, setProductsStatusState] = useState(DEFAULT_FILTERS.status);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState("create");
  const [editingProduct, setEditingProduct] = useState(null);

  // todo
  const requestIdRef = useRef(0);

  const openProductModal = useCallback(() => {
    setProductModalMode("create");
    setEditingProduct(null);
    setIsProductModalOpen(true);
  }, []);

  const openEditProduct = useCallback((product) => {
    setProductModalMode("edit");
    setEditingProduct(product);
    setIsProductModalOpen(true);
  }, []);

  const closeProductModal = useCallback(() => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductModalMode("create");
  }, []);

  const fetchProducts = useCallback(async (page, limit) => {
    const requestId = ++requestIdRef.current;
    setProductsLoading(true);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("nexmart-token") : null;

      if (!token) {
        if (requestId === requestIdRef.current) {
          setProducts([]);
          setProductsTotal(0);
          setProductsTotalPages(0);
        }

        return;
      }

      const skip = (page - 1) * limit;

      const filters = {
        search: productsSearch.trim(),
        category: productsCategory,
        brand: productsBrand,
        stockStatus: productsStock,
        status: productsStatus,
      };

      const result = await getProducts(limit, skip, token, filters);

      if (requestId !== requestIdRef.current) return;

      if (!result || result.success === false) {
        throw new Error(result?.message || "Failed to fetch products");
      }

      setProducts(result.products || []);
      setProductsTotal(result.total || 0);
      setProductsTotalPages(result.totalPages || 0);
    } catch (error) {
      if (requestId === requestIdRef.current) {
        console.error("Admin products fetch error:", error);

        showAlert?.(error.message || "Failed to load products", "danger");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setProductsLoading(false);
      }
    }
  }, [showAlert, productsSearch, productsCategory, productsBrand, productsStock, productsStatus]);

  useEffect(() => {
    if (!enabled) {
      setProductsLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchProducts(productsPage, productsLimit);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      requestIdRef.current += 1;
    };
  }, [enabled, productsPage, productsLimit, fetchProducts]);

  const setProductsPage = useCallback((page) => {
    setProductsPageState(page);
  }, []);

  const setProductsLimit = useCallback((limit) => {
    setProductsLimitState(limit);
    setProductsPageState(1);
  }, []);

  const setProductsSearch = useCallback((value) => {
    setProductsSearchState(value);
    setProductsPageState(1);
  }, []);

  const setProductsCategory = useCallback((value) => {
    setProductsCategoryState(value);
    setProductsPageState(1);
  }, []);

  const setProductsBrand = useCallback((value) => {
    setProductsBrandState(value);
    setProductsPageState(1);
  }, []);

  const setProductsStock = useCallback((value) => {
    setProductsStockState(value);
    setProductsPageState(1);
  }, []);

  const setProductsStatus = useCallback((value) => {
    setProductsStatusState(value);
    setProductsPageState(1);
  }, []);

  const resetProductsFilters = useCallback(() => {
    setProductsSearchState(DEFAULT_FILTERS.search);
    setProductsCategoryState(DEFAULT_FILTERS.category);
    setProductsBrandState(DEFAULT_FILTERS.brand);
    setProductsStockState(DEFAULT_FILTERS.stock);
    setProductsStatusState(DEFAULT_FILTERS.status);
    setProductsPageState(1);
  }, []);

  const refreshProducts = useCallback(() => {
    fetchProducts(productsPage, productsLimit);
  }, [fetchProducts, productsPage, productsLimit]);

  const toggleProductActive = useCallback(async (productId, isActive) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("nexmart-token") : null;

    if (!token) {
      showAlert?.("You are not authenticated", "danger");
      return { success: false };
    }

    try {
      const result = await updateProductStatus(productId, isActive, token);

      if (!result.success) {
        showAlert?.(result.message, "danger");
        return result;
      }

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === productId
            ? { ...product, isActive: result.product?.isActive ?? isActive }
            : product
        )
      );

      showAlert?.(isActive ? "Product restored successfully!" : "Product archived successfully!", "success");

      refreshProducts();

      return result;
    } catch (error) {
      console.error("Product status update error:", error);

      showAlert?.(error.message || "Failed to update product status", "danger");

      return { success: false, message: error.message };
    }
  }, [showAlert, refreshProducts]);

  return {
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
    resetProductsFilters,

    fetchProducts,
    refreshProducts,
    toggleProductActive,

    isProductModalOpen,
    productModalMode,
    editingProduct,
    openProductModal,
    openEditProduct,
    closeProductModal,
  };
}