import { Store, CheckCircle2, CircleAlert, PackageX } from "lucide-react";
import { useTranslations } from "next-intl";
import { BrandStatCard } from "@/index";

export default function BrandsStatsGrid({ brands = [] }) {
  const t = useTranslations("Admin.brands");

  const totalBrands = brands.length;
  const activeBrands = brands.filter((brand) => brand.isActive).length;
  const inactiveBrands = brands.filter((brand) => !brand.isActive).length;
  const unbrandedProducts = 0;

  const activePercentage = totalBrands ? Math.round((activeBrands / totalBrands) * 100) : 0;

  return (
    <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <BrandStatCard
        title={t("stats.totalBrands")}
        value={totalBrands}
        icon={Store}
        description={t("stats.addedThisQuarter")}
      />

      <BrandStatCard
        title={t("stats.brandsWithProducts")}
        value={activeBrands}
        icon={CheckCircle2}
        description={t("stats.activeDistribution", {
          percentage: activePercentage,
        })}
      />

      <BrandStatCard
        title={t("stats.inactiveBrands")}
        value={inactiveBrands}
        icon={CircleAlert}
        variant="warning"
        description={t("stats.reviewCredentials")}
      />

      <BrandStatCard
        title={t("stats.unbrandedProducts")}
        value={unbrandedProducts}
        icon={PackageX}
        variant="danger"
        description={t("stats.manufacturerTagRequired")}
      />
    </section>
  );
}