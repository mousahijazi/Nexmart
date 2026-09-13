import { useTranslations } from "next-intl";

export default function BlogSection() {
    const t = useTranslations("home.Blog");

    const posts = [
      { title: "كيف تختار سماعتك اللاسلكية المناسبة؟", tag: "دليل شراء", date: "١٢ أغسطس", slug: "blog-audio" },
      { title: "٧ أفكار لترتيب مجلسك قبل رمضان", tag: "المنزل", date: "٨ أغسطس", slug: "blog-home" },
      { title: "دليلك لاختيار العود والعطور الشرقية", tag: "عطور", date: "٣ أغسطس", slug: "blog-oud" },
    ];

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-14">
        <div className="flex items-end justify-between mb-[22px] gap-4 flex-wrap">
        <h2 className="font-bold text-[28px] text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">{t("title")}</h2>
        <div className="text-sm text-[var(--color-green)] dark:text-[var(--color-gold-light)] font-semibold cursor-pointer">{t("button")}</div>
        </div>
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 gap-4">
            {posts.map((ele, index) => (
                <div key={index} dir="rtl" className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl overflow-hidden cursor-pointer hover:shadow-[0_12px_30px_rgba(11,59,46,.08)]">
                    <div className="h-40 bg-[repeating-linear-gradient(45deg,#EDEBE2_0_6px,#F5F3EC_6px_12px)] flex items-center justify-center font-mono text-[9px] text-[var(--color-muted-2)]">{ele.slug}</div>
                    <div className="p-5">
                        <div className="text-xs text-[var(--color-gold)] mb-2">{ele.tag} · {ele.date}</div>
                        <div className="font-bold text-[16.5px] leading-[1.6] text-[var(--color-ink)]">{ele.title}</div>
                    </div>
                </div>
            ))}
        </div>
    </section>
  )
}
