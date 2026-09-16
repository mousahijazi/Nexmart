import { Zap, AlertTriangle } from "lucide-react";

export default function OrderPriorityIcon({ priority }) {
  if (priority === "urgent") {
    return (
      <Zap size={14} strokeWidth={2.5} className="shrink-0 text-[var(--color-gold)]" aria-label="Express order" />
    );
  }

  if (priority === "flagged") {
    return (
      <AlertTriangle size={14} strokeWidth={2.5} className="shrink-0 text-[var(--color-red)]" aria-label="Needs review" />
    );
  }

  return <span className="inline-block w-[14px]" aria-hidden="true" />;
}