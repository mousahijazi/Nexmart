"use client";
import { Pencil } from "lucide-react";
import { useAdminContext } from "@/Context/Adminprovider";

export default function EditCategoryButton({ category }) {
  const { openEditCategory } = useAdminContext();
  const name = category?.name?.en || category?.name?.ar || "category";

  return (
    <button
      type="button"
      onClick={() => openEditCategory(category)}
      aria-label={`Edit ${name}`}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-green-light)] hover:bg-[var(--color-sand)] hover:text-[var(--color-green)]"
    >
      <Pencil size={14} />
    </button>
  );
}