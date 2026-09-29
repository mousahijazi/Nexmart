"use client";
import { useCallback, useEffect, useState } from "react";
import { getProducts, updateProductStatus } from "@/helper/fetchApi";

const PRODUCTS_DEFAULT_LIMIT = 5;

export default function useAdminProducts({ showAlert }) {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsPage, setProductsPageState] = useState(1);
  const [productsLimit, setProductsLimitState] = useState(PRODUCTS_DEFAULT_LIMIT);
  const [productsTotal, setProductsTotal] = useState(0);
  const [productsTotalPages, setProductsTotalPages] = useState(0);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalMode, setProductModalMode] = useState("create");
  const [editingProduct, setEditingProduct] = useState(null);

  const openProductModal = () => {
    setProductModalMode("create");
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const openEditProduct = (product) => {
    setProductModalMode("edit");
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
    setProductModalMode("create");
  };

  const fetchProducts = useCallback(async (page, limit) => {
    const token = localStorage.getItem("nexmart-token");

    setProductsLoading(true);

    const skip = (page - 1) * limit;

    const result = await getProducts(limit, skip, token);

    setProducts(result.products);
    setProductsTotal(result.total);
    setProductsTotalPages(result.totalPages);

    setProductsLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts(productsPage, productsLimit);
  }, [productsPage, productsLimit, fetchProducts]);

  const setProductsPage = (page) => {
    setProductsPageState(page);
  };

  const setProductsLimit = (limit) => {
    setProductsLimitState(limit);
    setProductsPageState(1);
  };

  const refreshProducts = () => {
    if (productsPage === 1) {
      fetchProducts(1, productsLimit);
    } else {
      setProductsPageState(1);
    }
  };

  const toggleProductActive = async (productId, isActive) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await updateProductStatus(productId, isActive, token);

    if (!result.success) {
      showAlert(result.message, "danger");
      return result;
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product._id === productId
          ? {
              ...product,
              isActive: result.product?.isActive,
            }
          : product
      )
    );

    showAlert(isActive ? "Product restored successfully!" : "Product archived successfully!", "success");

    return result;
  };

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