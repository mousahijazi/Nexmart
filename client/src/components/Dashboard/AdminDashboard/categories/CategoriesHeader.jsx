import { Download, FolderTree } from "lucide-react";
import { AddCategoryButton } from "@/index";

export default function CategoriesHeader() {
  return (
    <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-green-dark)] text-white">
          <FolderTree size={22} />
        </div>

        <div className="min-w-0">
          <h1 className="text-[25px] font-medium leading-none tracking-[-0.035em] text-[var(--color-ink)] sm:text-[29px]">
            Categories
          </h1>
          <p className="mt-2 max-w-[650px] text-[11px] leading-[1.45] text-[var(--color-soft-2)] sm:text-[13px]">
            Manage platform product taxonomy, bilingual hierarchy,
            and assigned catalog listings.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto">
        <button
          type="button"
          className="flex min-h-[44px] items-center justify-center gap-2 rounded-[10px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-[11px] font-semibold text-[var(--color-ink)] transition hover:bg-[var(--color-sand)]"
        >
          <Download size={16} />
          <span>Export Categories<span className="sm:ml-1">CSV</span></span>
        </button>

        <AddCategoryButton />
      </div>
    </section>
  );
}