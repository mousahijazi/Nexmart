"use client";
import { useAdminContext } from "@/Context/Adminprovider";
import { useTranslations } from "next-intl";
// import AllOrdersPage from "./pages/AllOrdersPage";
// import InventoryPage from "./pages/InventoryPage";
// import CategoriesPage from "./pages/CategoriesPage";
// import SettlementsPage from "./pages/SettlementsPage";
// import DealsPromosPage from "./pages/DealsPromosPage";
// import ReportsSlaPage from "./pages/ReportsSlaPage";
import { SettingsDashboard, CategoriesDashboard, BrandsDashboard, CustomersPage, DashboardPage, OffersDashboard, SeasonsDashboard, OrdersDashboard, ProductsDashboard } from "@/index";

const PAGES = {
  dashboard: DashboardPage,
  "all-orders": OrdersDashboard,
//   inventory: <h1>InventoryPage</h1>,
  brand: BrandsDashboard,
  categories: CategoriesDashboard,
  customers: CustomersPage,
  products: ProductsDashboard,
  offers: OffersDashboard,
  seasons: SeasonsDashboard,
//   settlements: <h1>SettlementsPage</h1>,
//   deals: <h1>DealsPromosPage</h1>,
//   reports: <h1>ReportsSlaPage</h1>,
  settings: () => <SettingsDashboard role="admin" />
};

export default function AdminDashboardContent() {
  const { activeSection } = useAdminContext();
  const t = useTranslations("Admin.dashboard");

  const ActivePage = PAGES[activeSection] || null;

  if (!ActivePage) {
    return (
      <div className="flex flex-1 flex-col gap-6">
        <h1 className="text-xl font-semibold text-[var(--color-ink)]">
          {t("fallbackTitle")}
        </h1>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <ActivePage />
    </div>
  );
}