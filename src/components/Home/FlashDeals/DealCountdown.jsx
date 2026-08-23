"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { endOfDay } from "@/helper/fetchApi";

function getRemainingSeconds(endDate) {
  const end = endOfDay(endDate);
  const diffSeconds = Math.floor((end.getTime() - Date.now()) / 1000);
  return diffSeconds > 0 ? diffSeconds : 0;
}

export default function DealCountdown({ endDate }) {
  const t = useTranslations("home.deal");
  const [seconds, setSeconds] = useState(null);

  useEffect(() => {
    setSeconds(getRemainingSeconds(endDate));
  }, [endDate]);

  useEffect(() => {
    setSeconds(getRemainingSeconds(endDate));
  }, [endDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
 
    return () => clearInterval(interval);
  }, []);

  if (seconds === null) {
    return (
      <div className="flex gap-[10px]">
        {[t("hours"), t("minutes"), t("seconds")].map((label) => (
          <div key={label} className="min-w-[68px] rounded-xl border border-[var(--color-gold)]/30 bg-white/5 px-3 py-3 text-center backdrop-blur-sm">
            <div className="text-2xl font-bold tabular-nums text-[var(--color-gold)]">00</div>
            <div className="mt-1 text-[11px] text-[var(--color-soft)]">{label}</div>
          </div>
        ))}
      </div>
    );
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds / 60) % 60);
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
        <div key={unit.label} className="min-w-[75px] rounded-xl border border-[var(--color-gold)]/30 bg-white/5 px-3 py-3 text-center backdrop-blur-sm">
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