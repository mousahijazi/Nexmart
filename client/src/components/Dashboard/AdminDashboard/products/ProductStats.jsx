"use client";
import { useTranslations, useLocale } from "next-intl";
import { Package, CircleCheck, TriangleAlert, ShoppingCart } from "lucide-react";

function StatCard({ title, value, icon, type = "default", footer, footerValue }) {
  const styles = {
    default: {
      top: "bg-[var(--color-green-dark)]",
      value: "text-[var(--color-ink)]",
      icon: "text-[var(--color-green)]",
    },
    gold: {
      top: "bg-[var(--color-gold)]",
      value: "text-[var(--color-ink)]",
      icon: "text-[var(--color-gold)]",
    },
    warning: {
      top: "bg-[var(--color-gold-light)]",
      value: "text-[var(--color-gold)]",
      icon: "text-[var(--color-gold)]",
    },
    danger: {
      top: "bg-[var(--color-red)]",
      value: "text-[var(--color-red)]",
      icon: "text-[var(--color-red)]",
    },
  };

  const style = styles[type] || styles.default;

  return (
    <div className="relative min-w-0 overflow-hidden rounded-[15px] border border-[var(--color-border)] bg-[var(--color-cream)]">
      <div className={`absolute inset-x-0 top-0 h-[5px] ${style.top}`} />

      <div className="p-[17px] sm:p-[18px]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold tracking-[0.08em] text-[var(--color-muted)]">
              {title}
            </p>

            <p className={`mt-1 text-[30px] font-medium leading-none tracking-[-0.045em] sm:text-[32px] ${style.value}`}>
              {value}
            </p>
          </div>

          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-[var(--color-surface)] ${style.icon}`}>
            {icon}
          </div>
        </div>

        <div className="mt-6 min-h-[18px] text-[10px] leading-[1.25] text-[var(--color-soft-2)]">
          {footerValue && (
            <span
              className={`me-2 inline-flex rounded-[4px] px-1.5 py-1 font-semibold ${
                type === "danger"
                  ? "bg-[#F7D8D4] text-[var(--color-red)]"
                  : type === "warning"
                    ? "bg-[#F7E2A9] text-[#795A0C]"
                    : "bg-[#BDEEDB] text-[var(--color-green)]"
              }`}
            >
              {footerValue}
            </span>
          )}

          <span>{footer}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProductStats() {
  const t = useTranslations("Admin.products.stats");
  const locale = useLocale();

  const formatNumber = (number) => new Intl.NumberFormat(locale).format(number);

  return (
    <section className="mb-5 grid grid-cols-1 gap-3 xs:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title={t("totalSkus")}
        value={formatNumber(18920)}
        icon={<Package />}
        type="default"
        footer={t("addedThisMonth")}
        footerValue={`↑ +${formatNumber(412)}`}
      />

      <StatCard
        title={t("activeInStock")}
        value={formatNumber(17645)}
        icon={<CircleCheck />}
        type="gold"
        footer={`93.2% ${t("fulfillmentReady")}`}
      />

      <StatCard
        title={t("lowStockAlerts")}
        value={formatNumber(142)}
        icon={<TriangleAlert />}
        type="warning"
        footer={t("orderedForSkus", {
          count: formatNumber(89),
        })}
        footerValue={t("replenishment")}
      />

      <StatCard
        title={t("outOfStock")}
        value={formatNumber(38)}
        icon={<ShoppingCart />}
        type="danger"
        footer={t("restockPending")}
        footerValue={t("criticalAction")}
      />
    </section>
  );
}