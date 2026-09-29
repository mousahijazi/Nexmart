import { Pencil } from "lucide-react";

export default function AdminEditButton({ name, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Edit ${name}`}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-green-light)] hover:bg-[var(--color-sand)] hover:text-[var(--color-green)]"
    >
      <Pencil size={14} />
    </button>
  );
}