"use client";
import { useCallback, useEffect, useState } from "react";
import { getCategories, getCategoryProducts, createCategory, updateCategory, updateCategoryStatus } from "@/helper/fetchApi";

export default function useAdminCategories({ showAlert }) {
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesPage, setCategoriesPage] = useState(1);
  const [categoriesLimit, setCategoriesLimit] = useState(10);
  const [categoriesTotal, setCategoriesTotal] = useState(0);
  const [categoriesTotalPages, setCategoriesTotalPages] = useState(0);

  const [categoryProducts, setCategoryProducts] = useState({});
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState("create");
  const [editingCategory, setEditingCategory] = useState(null);

  const openCategoryModal = () => {
    setCategoryModalMode("create");
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategory = (category) => {
    setCategoryModalMode("edit");
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
    setCategoryModalMode("create");
  };

  const fetchCategories = useCallback(async (page, limit) => {
    setCategoriesLoading(true);

    const token = localStorage.getItem("nexmart-token");

    const result = await getCategories(limit, page, token);

    setCategories(result.categories);
    setCategoriesTotal(result.total);
    setCategoriesTotalPages(result.totalPages);

    setCategoriesLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories(categoriesPage, categoriesLimit);
  }, [categoriesPage, categoriesLimit, fetchCategories]);

  const addCategory = async (formData) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await createCategory(formData, token);

    if (!result.success) {
      return result;
    }

    if (categoriesPage === 1) {
      fetchCategories(1, categoriesLimit);
    } else {
      setCategoriesPage(1);
    }

    return result;
  };

  const editCategory = async (categoryId, formData) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await updateCategory(categoryId, formData, token);

    if (!result.success) {
      return result;
    }

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category._id === categoryId
          ? result.category
          : category
      )
    );

    return result;
  };

  const toggleCategoryActive = async (categoryId, isActive) => {
    const token = localStorage.getItem("nexmart-token");

    if (!token) {
      showAlert("You are not authenticated", "danger");
      return { success: false };
    }

    const result = await updateCategoryStatus(categoryId, isActive, token);

    if (!result.success) {
      showAlert(result.message, "danger");
      return result;
    }

    setCategories((currentCategories) =>
      currentCategories.map((category) =>
        category._id === categoryId
          ? {
              ...category,
              ...result.category,
            }
          : category
      )
    );

    setCategoryProducts((current) => {
      const updated = { ...current };
      delete updated[categoryId];
      return updated;
    });

    showAlert(isActive ? "Category restored successfully!" : "Category archived successfully!", "success");

    return result;
  };

  const fetchCategoryProducts = useCallback(
    async (categoryId, categorySlug, page = 1, limit = 10) => {
      const token = localStorage.getItem("nexmart-token");

      setCategoryProducts((current) => ({
        ...current,
        [categoryId]: {
          ...(current[categoryId] || {}),
          loading: true,
        },
      }));

      const result = await getCategoryProducts(categorySlug, limit, page, token);

      setCategoryProducts((current) => ({
        ...current,
        [categoryId]: {
          products: result.products,
          loading: false,
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages,
        },
      }));
    },
    []
  );

  const loadMoreCategoryProducts = useCallback(
    async (categoryId, categorySlug) => {
      const currentCategory = categoryProducts[categoryId];

      if (!currentCategory) return;
      if (currentCategory.loading) return;

      if (currentCategory.page >= currentCategory.totalPages) {
        return;
      }

      const token = localStorage.getItem("nexmart-token");

      if (!token) {
        showAlert("You are not authenticated", "danger");
        return { success: false };
      }

      const nextPage = currentCategory.page + 1;

      setCategoryProducts((current) => ({
        ...current,
        [categoryId]: {
          ...current[categoryId],
          loading: true,
        },
      }));

      const result = await getCategoryProducts(categorySlug, 10, nextPage, token);

      setCategoryProducts((current) => ({
        ...current,
        [categoryId]: {
          ...current[categoryId],
          products: [
            ...(current[categoryId]?.products || []),
            ...result.products,
          ],
          loading: false,
          page: result.page,
          total: result.total,
          totalPages: result.totalPages,
        },
      }));
    },
    [categoryProducts, showAlert]
  );

  return {
    categories,
    categoriesLoading,
    categoriesPage,
    setCategoriesPage,
    categoriesLimit,
    setCategoriesLimit,
    categoriesTotal,
    categoriesTotalPages,

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