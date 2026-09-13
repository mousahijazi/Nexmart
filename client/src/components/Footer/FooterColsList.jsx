import { useTranslations } from "next-intl";

export default function FooterColsList() {
  const t = useTranslations("footer");
  const footerCols = t.raw("columns");

  return (
    <>
      {footerCols.map((col, index) => (
        <div key={index}>
          <div className="text-white dark:text-[var(--color-gold)] font-semibold text-[15px] mb-4">
            {col.title}
          </div>
          <div className="flex flex-col gap-[11px] text-sm">
            {col.links.map((link, linkIndex) => (
              <span
                key={linkIndex}
                className="cursor-pointer w-fit text-gray-300 hover:text-[var(--color-gold)] transition-colors"
              >
                {link}
              </span>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}