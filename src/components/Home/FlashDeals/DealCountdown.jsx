"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function DealCountdown({ initialSeconds = 8 * 3600 + 10 * 60 }) {
  const t = useTranslations("home.deal");
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds / 60) % 60);
  const secs = seconds % 60;

  const units = [
    {
      value: hours,
      label: t("hours"),
    },
    {
      value: minutes,
      label: t("minutes"),
    },
    {
      value: secs,
      label: t("seconds"),
    },
  ];

  return (
    <div className="flex gap-[10px]">
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