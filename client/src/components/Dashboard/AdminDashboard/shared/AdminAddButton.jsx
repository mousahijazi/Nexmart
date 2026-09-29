import { Plus } from "lucide-react";

export default function AdminAddButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--color-gold)] px-3.5 py-2 text-sm font-medium text-[var(--color-green-dark)] hover:bg-[var(--color-gold-light)]"
    >
      <Plus size={15} />
      {label}
    </button>
  );
}