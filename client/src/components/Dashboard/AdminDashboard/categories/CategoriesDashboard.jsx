import { CategoriesHeader, CategoriesInteractive, CategoriesStats, CategoryModal } from "@/index";
import { categoriesData, categoryStats } from "./categoriesData";

export default function CategoriesDashboard() {
  return (
    <div className="min-w-0 bg-[var(--color-cream)] text-[var(--color-ink)]">
      <div className="mx-auto w-full max-w-[1120px] py-5 lg:py-3">
        <CategoriesHeader />
        <CategoryModal />
        <CategoriesStats stats={categoryStats} />
        <CategoriesInteractive categories={categoriesData} />
      </div>
    </div>
  );
}