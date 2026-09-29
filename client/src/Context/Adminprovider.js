"use client";
import { createContext, useContext, useState } from "react";
import { useAlertContext } from "./AlertProvider";

import useAdminProducts from "./admin/useAdminProducts";
import useAdminCategories from "./admin/useAdminCategories";
import useAdminBrands from "./admin/useAdminBrands";
import useAdminUsers from "./admin/useAdminUsers";

const AdminContext = createContext();

export default function AdminProvider({ children }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { showAlert } = useAlertContext();

  const productsAdmin = useAdminProducts({ showAlert });
  const categoriesAdmin = useAdminCategories({ showAlert });
  const brandsAdmin = useAdminBrands();
  const usersAdmin = useAdminUsers();

  const value = {
    activeSection,
    setActiveSection,

    ...productsAdmin,
    ...categoriesAdmin,
    ...brandsAdmin,
    ...usersAdmin,
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