"use client";
import { Plus } from "lucide-react";
import { useAdminContext } from "@/Context/Adminprovider";

export default function AddCategoryButton() {
  const { openCategoryModal } = useAdminContext();

  return (
    <button
      type="button"
      onClick={openCategoryModal}
      className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-[var(--color-gold)] px-3.5 py-2 text-sm font-medium text-[var(--color-green-dark)] hover:bg-[var(--color-gold-light)]"
    >
      <Plus size={15} />
      Add New Category
    </button>
  );
}