"use client";
import { Edit2 } from "lucide-react";

export default function EditProfileButton({ onClick, label = "Edit" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        flex items-center gap-2
        px-4 py-2
        rounded-xl
        border border-[var(--color-border)] dark:border-[#22332e]
        bg-[#FAF9F4] dark:bg-[#121a17]
        text-xs font-semibold
        text-[#0E4D3A] dark:text-[var(--color-gold)]
        hover:bg-[#EEF4F1] dark:hover:bg-[#122A23]
        transition cursor-pointer
      "
    >
      <Edit2 size={14} />
      <span>{label}</span>
    </button>
  );
}