import { perks } from "./data";
import { useTranslations } from "next-intl";

export default function StorePerks() {
    const t = useTranslations();

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-5">
        <div className="bg-white dark:bg-[var(--color-muted)] border border-[var(--color-border)] border-gray-300 rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((ele, index) => {
                const IconComponent = ele.icon;
                return(
                    <div key={index} className="px-6 py-5 flex border border-[var(--color-border)] border-gray-300 items-center gap-[14px]">
                        <div className="w-[42px] h-[42px] rounded-xl bg-[var(--color-surface)] dark:bg-[var(--color-gold)] text-[var(--color-green)] flex items-center justify-center text-lg shrink-0">
                            <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="font-semibold text-sm">{t(ele.title)}</div>
                            <div className="text-[12.5px] text-[var(--color-muted)] dark:text-zinc-500 mt-[2px]">{t(ele.sub)}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    </section>
  )
}
