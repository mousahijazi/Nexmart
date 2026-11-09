"use client";
import { createContext, useContext, useState } from "react";
import { useAlertContext } from "./AlertProvider";
import useAdminProducts from "./admin/useAdminProducts";
import useAdminCategories from "./admin/useAdminCategories";
import useAdminBrands from "./admin/useAdminBrands";
import useAdminUsers from "./admin/useAdminUsers";
import useAdminOffers from "./admin/useAdminOffers";
import useAdminSeasons from "./admin/useAdminSeasons";
import useAdminOrders from "./admin/useAdminOrders";

const AdminContext = createContext();

export default function AdminProvider({ children }) {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { showAlert } = useAlertContext();

  const productsAdmin = useAdminProducts({ showAlert, enabled: activeSection === "products" || activeSection === "dashboard" });
  const categoriesAdmin = useAdminCategories({ showAlert, enabled: activeSection === "categories" || activeSection === "products" || activeSection === "dashboard" });
  const brandsAdmin = useAdminBrands({ showAlert, enabled: activeSection === "brand" || activeSection === "products" || activeSection === "dashboard" });
   
  const offersAdmin = useAdminOffers({ showAlert, enabled: activeSection === "offers" });
  const seasonsAdmin = useAdminSeasons({ showAlert, enabled: activeSection === "seasons" || activeSection === "offers" });

  const ordersAdmin = useAdminOrders({ showAlert, enabled: activeSection === "all-orders" });
  
  const usersAdmin = useAdminUsers();

  const value = {
    activeSection,
    setActiveSection,

    ...productsAdmin,
    ...categoriesAdmin,
    ...brandsAdmin,

    ...usersAdmin,

    ...offersAdmin,
    ...seasonsAdmin,

    ...ordersAdmin,
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