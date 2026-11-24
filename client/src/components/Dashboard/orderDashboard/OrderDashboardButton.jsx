"use client";

export default function OrderDashboardButton({ onClick, disabled = false, icon, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="
        inline-flex items-center justify-center gap-2
        rounded-xl border border-[var(--color-border)]
        bg-white dark:bg-[#18221f]
        px-4 py-2
        text-sm font-semibold
        text-[var(--color-green-dark)] dark:text-[var(--color-gold)]
        transition hover:bg-[#FAF9F4] dark:hover:bg-[#22332e]
        disabled:cursor-not-allowed disabled:opacity-40
      "
    >
      {icon}
    </button>
  );
}