"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getAllUsers, getProducts, updateProductStatus } from "@/helper/fetchApi";
import { useAlertContext } from "./AlertProvider";

const AdminContext = createContext();

const PRODUCTS_DEFAULT_LIMIT = 5;

export default function AdminProvider({ children }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { showAlert } = useAlertContext();

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

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

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsPage, setProductsPageState] = useState(1);
  const [productsLimit, setProductsLimitState] = useState(PRODUCTS_DEFAULT_LIMIT);
  const [productsTotal, setProductsTotal] = useState(0);
  const [productsTotalPages, setProductsTotalPages] = useState(0);

  const fetchProducts = useCallback(async (page, limit) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }
    
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

  const setProductsPage = (page) => setProductsPageState(page);

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

  useEffect(() => {
    async function fetchAllAppUsers() {
      const token = localStorage.getItem("nexmart-token");
      if (!token) {
        setUsersLoading(false);
        return;
      }

      const result = await getAllUsers(token);
      if (result.status === "success" && Array.isArray(result.users)) {
        setUsers(result.users);
      }
      setUsersLoading(false);
    }

    fetchAllAppUsers();
  }, []);

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
        product._id === productId ? { ...product, isActive: result.product?.isActive } : product
      )
    );

    showAlert(isActive ? "Product restored successfully!" : "Product archived successfully!", "success");

    return result;
  };

  const value = {
    activeSection,
    setActiveSection,

    isProductModalOpen,
    productModalMode,
    editingProduct,

    openProductModal,
    openEditProduct,
    closeProductModal,

    users,
    usersCount: users.length,
    usersLoading,

    toggleProductActive,

    products,
    productsLoading,
    productsPage,
    setProductsPage,
    productsLimit,
    setProductsLimit,
    productsTotal,
    productsTotalPages,
    refreshProducts,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  return useContext(AdminContext);
}