"use client";
import { Archive, RotateCcw } from "lucide-react";

export default function AdminArchiveButton({ name, entity = "item", isActive, onClick, disabled = false, disabledReason }) {
  const action = isActive ? "Archive" : "Restore";
  const title = disabled && disabledReason ? disabledReason : `${action} ${entity}`;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`${action} ${name || entity}`}
      title={title}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-red)] hover:bg-[var(--color-sand)] hover:text-[var(--color-red)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--color-border)] disabled:hover:bg-transparent disabled:hover:text-[var(--color-muted)]"
    >
      {isActive ? <Archive size={14} /> : <RotateCcw size={14} />}
    </button>
  );
}