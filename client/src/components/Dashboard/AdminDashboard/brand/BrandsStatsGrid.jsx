import { Store, CheckCircle2, CircleAlert, PackageX } from "lucide-react";
import { BrandStatCard } from "@/index";

export default function BrandsStatsGrid({ brands = [] }) {
  const totalBrands = brands.length;
  const activeBrands = brands.filter((brand) => brand.isActive).length;
  const inactiveBrands = brands.filter((brand) => !brand.isActive).length;
  const unbrandedProducts = 0;

  return (
    <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <BrandStatCard
        title="Total Brands"
        value={totalBrands}
        icon={Store}
        description="+5 added this quarter"
      />

      <BrandStatCard
        title="Brands With Products"
        value={activeBrands}
        icon={CheckCircle2}
        description={
          totalBrands
            ? `${Math.round((activeBrands / totalBrands) * 100)}% active distribution`
            : "0% active distribution"
        }
      />

      <BrandStatCard
        title="Inactive Brands"
        value={inactiveBrands}
        icon={CircleAlert}
        variant="warning"
        description="Action required: review credentials"
      />

      <BrandStatCard
        title="Unbranded Products"
        value={unbrandedProducts}
        icon={PackageX}
        variant="danger"
        description="Requires manufacturer tag"
      />
    </section>
  );
}