"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

function getRemainingSeconds(endDate) {
  const end = new Date(endDate).getTime();
  if (!Number.isFinite(end)) return 0;
  return Math.max(0, Math.floor((end - Date.now()) / 1000));
}

export default function DealCountdown({ endDate }) {
  const t = useTranslations("home.deal");
  const [seconds, setSeconds] = useState(null);

  useEffect(() => {
    setSeconds(getRemainingSeconds(endDate));

    const interval = setInterval(() => {
      setSeconds(getRemainingSeconds(endDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate]);

  if (seconds === null) {
    return null;
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const units = [
    ...(days > 0 ? [{ value: days, label: t("days") }] : []),
    { value: hours, label: t("hours") },
    { value: minutes, label: t("minutes") },
    { value: secs, label: t("seconds") },
  ];

  return (
    <div className="flex flex-wrap gap-[10px]">
      {units.map((unit) => (
        <div key={unit.label} className="min-w-[68px] rounded-xl border border-[var(--color-gold)]/30 bg-white/5 px-3 py-3 text-center backdrop-blur-sm">
          <div className="text-2xl font-bold tabular-nums text-[var(--color-gold)]">
            {String(unit.value).padStart(2, "0")}
          </div>

          <div className="mt-1 text-[11px] text-[var(--color-soft)]">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}