import { ProductStars } from "@/index";

export default function Reviews() {
  const reviews = [
    { rating: "5", text: "طلبت الساعة يوم الأحد ووصلتني الثلاثاء بالرياض. التغليف ممتاز والمنتج أصلي ١٠٠٪.", name: "نورة السالم", city: "الرياض", initials: "نس" },
    { rating: "5", text: "أحلى شي فيهم خدمة العملاء، ردوا علي بسرعة وبدلوا لي المقاس بدون أي تعقيد.", name: "فيصل العتيبي", city: "جدة", initials: "فع" },
    { rating: "5", text: "الأسعار منافسة والدفع بمدى سهل جداً. صار متجري الأساسي لأغراض البيت.", name: "ريم القحطاني", city: "الدمام", initials: "رق" },
  ];

  return (
    <section className="max-w-[1280px] mx-auto px-6 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((ele, index) => (
          <div key={index} className="bg-white dark:bg-[var(--color-soft-2)] border border-[var(--color-border)] rounded-2xl p-[26px]">
            <ProductStars rating={ele.rating} />
            <p className="mb-5 text-[15px] leading-[1.9] text-[var(--color-soft)] dark:text-white">{ele.text}</p>
            <div dir="rtl" className="flex items-center gap-[11px] pt-4 border-t border-[var(--color-divider)]">
              <div className="w-9 h-9 rounded-full bg-[#E7EDE9] text-[var(--color-green)] flex items-center justify-center text-xs font-bold shrink-0">{ele.initials}</div>
              <div>
                <div className="text-[13.5px] font-semibold dark:text-white">{ele.name}</div>
                <div className="text-xs text-[var(--color-muted)] font-bold dark:text-[var(--color-gold)]">{ele.city}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
