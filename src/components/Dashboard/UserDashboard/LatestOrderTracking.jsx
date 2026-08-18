"use client";
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { useLocale, useTranslations } from "next-intl";

const STATUS_STYLES = {
  done: { dot: "#0E4D3A", ring: "#CFE0D8", line: "#0E4D3A", fg: "#12211C" },
  pending: { dot: "#D4A94A", ring: "#F3E4C4", line: "#E2E0D5", fg: "#12211C" },
  failed: { dot: "#DC2626", ring: "#FCA5A5", line: "#E2E0D5", fg: "#12211C" },
  upcoming: { dot: "#DCDAD0", ring: "#EFEDE4", line: "transparent", fg: "#9A998C" },
};

export default function LatestOrderTracking() {
  const { orders, ordersLoading } = useCheckoutContext();
  const locale = useLocale();
  const t = useTranslations("profile.latestOrderTracking");

  if (ordersLoading) {
    return (
      <div className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-6 animate-pulse">
        <div className="h-5 bg-gray-200 dark:bg-zinc-700 rounded w-1/2 mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-zinc-700 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          <div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl"></div>
          <div className="h-10 bg-gray-100 dark:bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[220px]">
        <p className="font-semibold text-base dark:text-gray-200 mb-1">
          {t("noOrdersTitle")}
        </p>
        <p className="text-xs text-[var(--color-muted)] dark:text-gray-400">
          {t("noOrdersDesc")}
        </p>
      </div>
    );
  }

  const latestOrder = orders[0];
  const dateFormatter = new Intl.DateTimeFormat(locale === "ar" ? "ar" : "en-US");
  const time = dateFormatter.format(new Date(latestOrder.created_at));

  const paymentStatus = latestOrder.payment_status;
  const shippingStatus = latestOrder.status;

  const paymentStepStatus = paymentStatus === "paid" ? "done" : paymentStatus === "failed" ? "failed" : "pending";

  const shippedStepStatus =
    paymentStepStatus !== "done"
      ? "upcoming"
      : shippingStatus === "shipped" || shippingStatus === "delivered"
      ? "done"
      : "pending";

  const deliveredStepStatus = shippingStatus === "delivered" ? "done" : "upcoming";

  const tracking = [
    {
      title: t("stepReceived"),
      status: "done",
      time,
    },
    {
      title:
        paymentStepStatus === "done"
          ? t("stepPaymentDone")
          : paymentStepStatus === "failed"
          ? t("stepPaymentFailed")
          : t("stepPaymentPending"),
      status: paymentStepStatus,
      time,
    },
    {
      title: t("stepShipped"),
      status: shippedStepStatus,
      time: shippedStepStatus === "done" ? time : "—",
    },
    {
      title: deliveredStepStatus === "done" ? t("stepDelivered") : t("stepDelivery"),
      status: deliveredStepStatus,
      time: deliveredStepStatus === "done" ? time : "متوقع اليوم ٤:٠٠ - ٧:٠٠ م",
    },
  ];

  return (
    <div className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-6">
      <div className="font-bold text-[17px] mb-[6px] dark:text-gray-100">
        {t("trackingTitle")}{latestOrder.id.slice(0, 8)}
      </div>
      <div className="text-[13px] text-[var(--color-muted)] dark:text-gray-400 mb-[22px]">
        متوقع الوصول اليوم بين ٤ و ٧ مساءً
      </div>

      <div>
        {tracking.map((step, index) => {
          const style = STATUS_STYLES[step.status] ?? STATUS_STYLES.upcoming;
          const isLast = index === tracking.length - 1;

          return (
            <div key={index} className="grid grid-cols-[22px_1fr] gap-[14px]">
              <div className="flex flex-col items-center">
                <div style={{ backgroundColor: style.dot, borderColor: style.ring }} className="w-[13px] h-[13px] rounded-full border-[3px] shrink-0"></div>
                {!isLast && (
                  <div style={{ backgroundColor: style.line }} className="flex-1 w-[2px] min-h-[34px]"></div>
                )}
              </div>
              <div className="pb-2">
                <div style={{ color: style.fg }} className="text-sm font-semibold dark:!text-gray-200">
                  {step.title}
                </div>
                <div className="text-[12.5px] text-[var(--color-muted)] dark:text-gray-400 mt-[3px]">
                  {step.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
