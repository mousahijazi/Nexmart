"use client";
import { useState } from "react";
import { Check, X, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OnHoldDecisionForm({ submitting = false, onApprove, onReject }) {
    const t = useTranslations("Admin.orders");
    const [reason, setReason] = useState("");
    const [decision, setDecision] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const cleanReason = reason.trim();

        if (!cleanReason || submitting) return;

        await (decision === "approved" ? onApprove(cleanReason) : onReject(cleanReason));
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-[14px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <h3 className="mb-2 text-sm font-bold text-[var(--color-ink)]">
                {t("onHold.decisionTitle")}
            </h3>

            <p className="mb-4 text-xs leading-6 text-[var(--color-muted)]">
                {t("onHold.decisionDescription")}
            </p>

            <label htmlFor="on-hold-reason" className="mb-2 block text-xs font-semibold text-[var(--color-ink)]">
                {t("onHold.reasonLabel")}
            </label>

            <textarea
                id="on-hold-reason"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                maxLength={1000}
                required
                rows={3}
                disabled={submitting}
                placeholder={t("onHold.reasonPlaceholder")}
                className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-cream)] p-3 text-sm text-[var(--color-ink)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-gold)] focus:ring-2 focus:ring-[var(--color-gold)]/20 disabled:opacity-60"
            />

            <div className="mt-1 text-end text-[10px] text-[var(--color-muted)]">
                {reason.length}/1000
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                        setDecision("approved");
                        document.getElementById("on-hold-reason")?.focus();
                    }}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-50 ${
                        decision === "approved"
                            ? "border-[var(--color-green)] bg-[var(--color-green)] text-white"
                            : "border-[var(--color-green)]/30 bg-[var(--color-green)]/10 text-[var(--color-green-dark)] hover:bg-[var(--color-green)]/20"
                    }`}
                >
                    <Check size={16} />
                    {t("onHold.approve")}
                </button>

                <button
                    type="button"
                    disabled={submitting}
                    onClick={() => {
                        setDecision("rejected");
                        document.getElementById("on-hold-reason")?.focus();
                    }}
                    className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-red)] disabled:cursor-not-allowed disabled:opacity-50 ${
                        decision === "rejected"
                            ? "border-[var(--color-red)] bg-[var(--color-red)] text-white"
                            : "border-[var(--color-red)]/30 bg-[var(--color-red)]/10 text-[var(--color-red)] hover:bg-[var(--color-red)]/15"
                    }`}
                >
                    <X size={16} />
                    {t("onHold.reject")}
                </button>
            </div>

            <button
                type="submit"
                disabled={submitting || !decision || !reason.trim()}
                className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-green-dark)] px-4 py-3 text-xs font-bold text-white transition hover:bg-[var(--color-green)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-45"
            >
                {submitting ? (
                    <>
                        <LoaderCircle size={16} className="animate-spin" />
                        {t("onHold.processing")}
                    </>
                ) : (
                    t("onHold.confirmDecision")
                )}
            </button>
        </form>
    );
}