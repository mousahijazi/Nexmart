"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { getProducts, updateProductStatus } from "@/helper/fetchApi";

const PRODUCTS_DEFAULT_LIMIT = 5;

export default function useAdminProducts({ showAlert, enabled }) {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsPage, setProductsPageState] = useState(1);
  const [productsLimit, setProductsLimitState] = useState(PRODUCTS_DEFAULT_LIMIT);

  const [productsTotal, setProductsTotal] = useState(0);
  const [productsTotalPages, setProductsTotalPages] = useState(0);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState("create");
  const [editingProduct, setEditingProduct] = useState(null);

  const requestIdRef = useRef(0);
  const mountedRef = useRef(false);

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
      const result = await getProducts(limit, skip, token);
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
        showAlert?.( error.message || "Failed to load products", "danger");
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setProductsLoading(false);
      }
    }
  }, [showAlert]);

  useEffect(() => {
    if (!enabled) return;
    
    mountedRef.current = true;

    fetchProducts(productsPage, productsLimit);

    return () => {
      mountedRef.current = false;
      requestIdRef.current += 1;
    };
  }, [productsPage, productsLimit, fetchProducts, enabled]);

  const setProductsPage = useCallback((page) => {
    setProductsPageState(page);
  }, []);

  const setProductsLimit = useCallback((limit) => {
    setProductsLimitState(limit);
    setProductsPageState(1);
  }, []);

  const refreshProducts = useCallback(() => {
    fetchProducts(productsPage, productsLimit);
  }, [fetchProducts, productsPage, productsLimit]);

  const toggleProductActive = useCallback(
    async (productId, isActive) => {
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

        return result;
      } catch (error) {
        console.error("Product status update error:", error);

        showAlert?.(
          error.message || "Failed to update product status",
          "danger"
        );

        return { success: false, message: error.message };
      }
    },
    [showAlert]
  );

  return {
    products,
    productsLoading,
    productsPage,
    setProductsPage,
    productsLimit,
    setProductsLimit,
    productsTotal,
    productsTotalPages,
    refreshProducts,

    isProductModalOpen,
    productModalMode,
    editingProduct,

    openProductModal,
    openEditProduct,
    closeProductModal,

    toggleProductActive,
  };
}