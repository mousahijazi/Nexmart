"use client";
import { createContext, useContext, useState } from "react";

const AdminContext = createContext();

export default function AdminProvider({ children }) {
  const [activeSection, setActiveSection] = useState("dashboard");

  const value = {
    activeSection,
    setActiveSection,
  };

  return (
    <AdminContext.Provider value={value}>
        {children}
    </AdminContext.Provider>
  )
}

export function useAdminContext() {
  return useContext(AdminContext);
}