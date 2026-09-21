"use client";
import { Pencil } from "lucide-react";
import { useAdminContext } from "@/Context/Adminprovider";

export default function EditPoductsButton({ product }) {
  const { openEditProduct } = useAdminContext();
  const name = product?.title?.en || product?.title?.ar || "product";

  return (
    <button
      type="button"
      onClick={() => openEditProduct(product)}
      aria-label={`Edit ${name}`}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:border-[var(--color-green-light)] hover:bg-[var(--color-sand)] hover:text-[var(--color-green)]"
    >
      <Pencil size={14} />
    </button>
  );
}