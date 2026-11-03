"use client";
import { useCallback, useRef, useState, useEffect } from "react";
import { getCategories, getCategoryProducts, createCategory, updateCategory, updateCategoryStatus } from "@/helper/fetchApi";

const CATEGORIES_DEFAULT_LIMIT = 10;
const CATEGORY_PRODUCTS_LIMIT = 10;

export default function useAdminCategories({ showAlert, enabled }) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const [categoriesPage, setCategoriesPageState] = useState(1);
  const [categoriesLimit, setCategoriesLimitState] = useState(CATEGORIES_DEFAULT_LIMIT);

  const [categoriesTotal, setCategoriesTotal] = useState(0);
  const [categoriesTotalPages, setCategoriesTotalPages] = useState(0);

  const [categoriesSearch, setCategoriesSearch] = useState("");
  const [categoriesStatusFilter, setCategoriesStatusFilter] = useState("");

  const [categoryStats, setCategoryStats] = useState(null);

  const [categoryProducts, setCategoryProducts] = useState({});

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState("create");
  const [editingCategory, setEditingCategory] = useState(null);

  const categoriesRequestId = useRef(0);

  const openCategoryModal = useCallback(() => {
    setCategoryModalMode("create");
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  }, []);

  const openEditCategory = useCallback((category) => {
    setCategoryModalMode("edit");
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  }, []);

  const closeCategoryModal = useCallback(() => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryModalMode("create");
  }, []);

  const fetchCategories = useCallback(
    async ({ page = categoriesPage, limit = categoriesLimit, search = categoriesSearch, status = categoriesStatusFilter } = {}) => {
      // todo
      const requestId = ++categoriesRequestId.current;

      const token = typeof window !== "undefined" ? localStorage.getItem("nexmart-token") : null;

      if (!token) {
        setCategories([]);
        setCategoriesTotal(0);
        setCategoriesTotalPages(0);
        setCategoryStats(null);
        setCategoriesLoading(false);

        showAlert?.("You are not authenticated", "danger");

        return { success: false };
      }

      setCategoriesLoading(true);

      try {
        const result = await getCategories(limit, page, token, { search, status });

        if (requestId !== categoriesRequestId.current) {
          return { success: false, stale: true };
        }

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch categories");
        }

        setCategories(result.categories);
        setCategoriesTotal(result.total);
        setCategoriesTotalPages(result.totalPages);

        setCategoryStats(result.stats);

        return {
          success: true,
          categories: result.categories,
          total: result.total,
          page: result.page,
          totalPages: result.totalPages,
          stats: result.stats,
        };
      } catch (error) {
        if (requestId === categoriesRequestId.current) {
          console.error("Admin categories fetch error:", error);

          showAlert?.(error.message || "Failed to load categories", "danger");
        }

        return {
          success: false,
          message: error.message,
        };
      } finally {
        if (requestId === categoriesRequestId.current) {
          setCategoriesLoading(false);
        }
      }
    }, [categoriesPage, categoriesLimit, categoriesSearch, categoriesStatusFilter, showAlert,]
  );

  useEffect(() => {
    if (!enabled) return;

    fetchCategories();

    return () => {
      categoriesRequestId.current += 1;
    };
  }, [enabled, fetchCategories]);

  const setCategoriesPage = useCallback((page) => {
    setCategoriesPageState(page);
  }, []);

  const setCategoriesLimit = useCallback((limit) => {
    const parsedLimit = Number(limit);

    if (!Number.isFinite(parsedLimit) || parsedLimit < 1) return;

    setCategoriesLimitState(parsedLimit);
    setCategoriesPageState(1);
  }, []);

  const changeCategoriesPage = useCallback((page) => {
    if (page < 1 || page > categoriesTotalPages || categoriesLoading) {
      return;
    }

    setCategoriesPageState(page);
  }, [categoriesTotalPages, categoriesLoading]);

  const searchCategories = useCallback((search) => {
    setCategoriesSearch(search);
    setCategoriesPageState(1);
  }, []);

  const filterCategoriesByStatus = useCallback((status) => {
    setCategoriesStatusFilter(status);
    setCategoriesPageState(1);
  }, []);

  const resetCategoriesFilters = useCallback(() => {
    setCategoriesSearch("");
    setCategoriesStatusFilter("");
    setCategoriesPageState(1);
  }, []);

  const refreshCategories = useCallback(() => {
    return fetchCategories();
  }, [fetchCategories]);

  const addCategory = useCallback(async (formData) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert?.("You are not authenticated", "danger");
      return { success: false };
    }

    try {
      const result = await createCategory(formData, token);

      if (!result.success) {
        showAlert?.(result.message || "Failed to create category", "danger");
        return result;
      }

      // todo
      if (categoriesPage !== 1) {
        setCategoriesPageState(1);
      } else {
        await fetchCategories({ page: 1 });
      }

      showAlert?.("Category created successfully", "success");

      return result;
    } catch (error) {
      showAlert?.(error.message || "Failed to create category", "danger");

      return {
        success: false,
        message: error.message,
      };
    }
  }, [categoriesPage, fetchCategories, showAlert]);

  const editCategory = useCallback(async (categoryId, formData) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert?.("You are not authenticated", "danger");
      return { success: false };
    }

    try {
      const result = await updateCategory(categoryId, formData, token);

      if (!result.success) {
        showAlert?.(result.message || "Failed to update category", "danger");
        return result;
      }

      await fetchCategories();

      setCategories((currentCategories) =>
        currentCategories.map((category) =>
          category._id === categoryId
            ? result.category
            : category
        )
      );

      showAlert?.("Category updated successfully", "success");

      return result;
    } catch (error) {
      showAlert?.(error.message || "Failed to update category", "danger");

      return {
        success: false,
        message: error.message,
      };
    }
  }, [fetchCategories, showAlert]);

  const toggleCategoryActive = useCallback(async (categoryId, isActive) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert?.("You are not authenticated", "danger");
      return { success: false };
    }

    try {
      const result = await updateCategoryStatus(categoryId, isActive, token);

      if (!result.success) {
        showAlert?.(result.message || "Failed to update category status", "danger");
        
        return result;
      }

      await fetchCategories();

      setCategoryProducts((current) => {
        const updated = { ...current };
        delete updated[categoryId];
        return updated;
      });

      showAlert?.(isActive ? "Category restored successfully" : "Category archived successfully", "success");

      return result;
    } catch (error) {
      showAlert?.(error.message || "Failed to update category status", "danger");

      return {
        success: false,
        message: error.message,
      };
    }
  }, [fetchCategories, showAlert]);

  const fetchCategoryProducts = useCallback(async (categoryId, categorySlug, page = 1, limit = CATEGORY_PRODUCTS_LIMIT) => {
    const currentCategory = categoryProducts[categoryId];

    if (page === 1 && currentCategory?.loaded) {
      return {
        success: true,
        products: currentCategory.products,
      };
    }

    if (currentCategory?.loading) {
      return { success: false };
    }

    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert?.("You are not authenticated", "danger");
      return { success: false };
    }

    setCategoryProducts((current) => ({
      ...current,
      [categoryId]: {
        ...(current[categoryId] || {}),
        loading: true,
      },
    }));

    try {
      const result = await getCategoryProducts(categorySlug, limit, page, token);

      setCategoryProducts((current) => ({
        ...current,
        [categoryId]: {
          products:
            page === 1
              ? result.products || []
              : [...(current[categoryId]?.products || []), ...(result.products || [])],
          loading: false,
          loaded: true,
          page: result.page || page,
          limit: result.limit || limit,
          total: result.total || 0,
          totalPages: result.totalPages || 0,
        },
      }));

      return {
        success: true,
        products: result.products || [],
      };
    } catch (error) {
      console.error("Category products fetch error:", error);

      setCategoryProducts((current) => ({
        ...current,
        [categoryId]: {
          ...(current[categoryId] || {}),
          loading: false,
        },
      }));

      showAlert?.(error.message || "Failed to load category products", "danger");

      return {
        success: false,
        message: error.message,
      };
    }
  }, [categoryProducts, showAlert]);

  const loadMoreCategoryProducts = useCallback(async (categoryId, categorySlug) => {
    const currentCategory = categoryProducts[categoryId];

    if (!currentCategory || currentCategory.loading) {
      return { success: false };
    }

    if (currentCategory.page >= currentCategory.totalPages) {
      return { success: false };
    }

    return fetchCategoryProducts(categoryId, categorySlug, currentCategory.page + 1, CATEGORY_PRODUCTS_LIMIT);
  }, [categoryProducts, fetchCategoryProducts]);

  return {
    categories,
    categoriesLoading,
    categoriesPage,
    setCategoriesPage,
    categoriesLimit,
    setCategoriesLimit,
    categoriesTotal,
    categoriesTotalPages,

    categoriesSearch,
    searchCategories,
    categoriesStatusFilter,
    filterCategoriesByStatus,
    resetCategoriesFilters,

    categoryStats,

    fetchCategories,
    refreshCategories,
    changeCategoriesPage,

    categoryProducts,
    fetchCategoryProducts,
    loadMoreCategoryProducts,

    isCategoryModalOpen,
    categoryModalMode,
    editingCategory,
    openCategoryModal,
    openEditCategory,
    closeCategoryModal,

    addCategory,
    editCategory,
    toggleCategoryActive,
  };
}