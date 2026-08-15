import { useTranslations } from "next-intl";

export default function PayList() {
  const t = useTranslations("footer");
  const payBadges = t.raw("payBadges");

  return (
    <div className="flex items-center gap-[10px] flex-wrap">
      {payBadges.map((ele, index) => (
        <div
          key={index}
          className="bg-[var(--color-surface)] dark:bg-[var(--color-field)] text-[var(--color-green-dark)] dark:text-[var(--color-gold)] rounded-lg px-[14px] py-[7px] text-xs font-semibold border border-[var(--color-border)] shadow-sm"
        >
          {ele}
        </div>
      ))}
    </div>
  );
}