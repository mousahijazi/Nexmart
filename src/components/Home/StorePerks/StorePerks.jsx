import { perks } from "./data";
import { useTranslations } from "next-intl";

export default function StorePerks() {
    const t = useTranslations();

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-5">
        <div className="bg-white border border-border rounded-2xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {perks.map((ele, index) => (
            <div key={index} className="px-6 py-5 flex items-center gap-[14px] ">
                <div className="w-[42px] h-[42px] rounded-xl bg-[var(--color-surface)] text-[var(--color-green)] flex items-center justify-center text-lg shrink-0">
                    {ele.icon}
                </div>
                <div>
                    <div className="font-semibold text-sm">{t(ele.title)}</div>
                    <div className="text-[12.5px] text-[var(--color-muted)] mt-[2px]">{t(ele.sub)}</div>
                </div>
            </div>
            ))}
        </div>
    </section>
  )
}
