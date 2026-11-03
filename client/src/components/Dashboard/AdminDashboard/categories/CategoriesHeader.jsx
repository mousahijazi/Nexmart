"use client";
import { FolderTree } from "lucide-react";
import { AdminAddButton } from "@/index";
import { useAdminContext } from "@/Context/Adminprovider";
import { useTranslations } from "next-intl";

export default function CategoriesHeader() {
  const t = useTranslations("Admin.categories");
  const { openCategoryModal } = useAdminContext();

  return (
    <section className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] bg-[var(--color-green-dark)] text-white">
          <FolderTree size={22} />
        </div>

        <div className="min-w-0">
          <h1 className="text-[25px] font-medium leading-none tracking-[-0.035em] text-[var(--color-ink)] sm:text-[29px]">
            {t("title")}
          </h1>

          <p className="mt-2 max-w-[650px] text-[11px] leading-[1.45] text-[var(--color-soft-2)] sm:text-[13px]">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center gap-2 xl:w-auto">
        <AdminAddButton
          label={t("addCategory")}
          onClick={openCategoryModal}
        />
      </div>
    </section>
  );
}