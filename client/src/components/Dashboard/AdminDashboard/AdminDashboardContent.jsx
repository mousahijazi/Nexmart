"use client";
import { useAdminContext } from "@/Context/Adminprovider";
import { useTranslations } from "next-intl";
import { SettingsDashboard, CategoriesDashboard, BrandsDashboard, CustomersPage, DashboardPage, OffersDashboard, SeasonsDashboard, OrdersDashboard, ProductsDashboard } from "@/index";

const PAGES = {
  dashboard: DashboardPage,
  "all-orders": OrdersDashboard,
  brand: BrandsDashboard,
  categories: CategoriesDashboard,
  customers: CustomersPage,
  products: ProductsDashboard,
  offers: OffersDashboard,
  seasons: SeasonsDashboard,
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