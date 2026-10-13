"use client";
import { createContext, useContext, useState } from "react";
import { useAlertContext } from "./AlertProvider";
import useAdminProducts from "./admin/useAdminProducts";
import useAdminCategories from "./admin/useAdminCategories";
import useAdminBrands from "./admin/useAdminBrands";
import useAdminUsers from "./admin/useAdminUsers";
import useAdminOffers from "./admin/useAdminOffers";
import useAdminSeasons from "./admin/useAdminSeasons";

const AdminContext = createContext();

export default function AdminProvider({ children }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { showAlert } = useAlertContext();

  const productsAdmin = useAdminProducts({ showAlert });
  const categoriesAdmin = useAdminCategories({ showAlert });
  const brandsAdmin = useAdminBrands({ showAlert });
  
  const usersAdmin = useAdminUsers();

  const offersAdmin = useAdminOffers({ showAlert });
  const seasonsAdmin = useAdminSeasons({ showAlert });

  const value = {
    activeSection,
    setActiveSection,

    ...productsAdmin,
    ...categoriesAdmin,
    ...brandsAdmin,

    ...usersAdmin,

    ...offersAdmin,
    ...seasonsAdmin,
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