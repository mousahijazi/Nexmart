"use client";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function BrandModalFooter({ isEdit, submitting, onClose }) {
  const t = useTranslations("Admin.brands.modal");

  return (
    <div className="flex shrink-0 items-center justify-end gap-2 border-t border-[var(--color-divider)] px-5 py-4 sm:px-6">
      <button
        type="button"
        onClick={onClose}
        disabled={submitting}
        className="rounded-xl border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium text-[var(--color-ink)] transition hover:bg-[var(--color-sand)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {t("actions.cancel")}
      </button>

      <button
        type="submit"
        form="brand-form"
        disabled={submitting}
        className="flex items-center gap-1.5 rounded-xl bg-[var(--color-gold)] px-3.5 py-2 text-sm font-semibold text-[var(--color-green-dark)] transition hover:bg-[var(--color-gold-light)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting && (
          <Loader2 size={15} className="animate-spin" />
        )}

        {submitting
          ? isEdit ? t("actions.updating") : t("actions.adding")
          : isEdit ? t("actions.update") : t("actions.add")}
      </button>
    </div>
  );
}