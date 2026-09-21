"use client";
import { useAdminContext } from "@/Context/Adminprovider";
import {DashboardPage} from "@/index";
// import AllOrdersPage from "./pages/AllOrdersPage";
// import InventoryPage from "./pages/InventoryPage";
// import CategoriesPage from "./pages/CategoriesPage";
import ProductsDashboard from "./products/ProductsDashboard";
import {CustomersPage} from "@/index";
// import SettlementsPage from "./pages/SettlementsPage";
// import DealsPromosPage from "./pages/DealsPromosPage";
// import ReportsSlaPage from "./pages/ReportsSlaPage";
// import SettingsPage from "./pages/SettingsPage";

const PAGES = {
  dashboard: DashboardPage,
//   "all-orders": <h1>AllOrdersPage</h1>,
//   inventory: <h1>InventoryPage</h1>,
//   categories: <h1>CategoriesPage</h1>,
  customers: CustomersPage,
  products: ProductsDashboard,
//   settlements: <h1>SettlementsPage</h1>,
//   deals: <h1>DealsPromosPage</h1>,
//   reports: <h1>ReportsSlaPage</h1>,
//   settings: <h1>SettingsPage</h1>,
};

export default function AdminDashboardContent() {
  const { activeSection } = useAdminContext();
  const ActivePage = PAGES[activeSection] ||(() => <h1>Dashboard Home</h1>);

  return (
    <div className="flex flex-1 flex-col gap-6">
      <ActivePage />
    </div>
  );
}