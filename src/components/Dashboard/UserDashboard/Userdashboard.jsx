import { Dashbaord, StatsSection, UserProfileInfo, UserNav } from "@/index";

export default function Userdashboard() {
  const tracking = [
    { title: "تم استلام الطلب", time: "١٢ أغسطس · ٩:٤٠ ص", dot: "#0E4D3A", ring: "#CFE0D8", line: "#0E4D3A", fg: "#12211C" },
    { title: "تم تأكيد الدفع عبر ميسر", time: "١٢ أغسطس · ٩:٤٢ ص", dot: "#0E4D3A", ring: "#CFE0D8", line: "#0E4D3A", fg: "#12211C" },
    { title: "خرجت الشحنة من المستودع", time: "١٣ أغسطس · ٧:١٥ ص", dot: "#D4A94A", ring: "#F3E4C4", line: "#E2E0D5", fg: "#12211C" },
    { title: "التسليم للعميل", time: "متوقع اليوم ٤:٠٠ - ٧:٠٠ م", dot: "#DCDAD0", ring: "#EFEDE4", line: "transparent", fg: "#9A998C" },
  ];

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,260px)_1fr] gap-5 items-start">
        <aside className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-[22px] lg:sticky lg:top-[150px]">
          <UserProfileInfo />
          <UserNav />
        </aside>
        
        <div className="flex flex-col gap-4">
          <StatsSection />

          <Dashbaord showData="orderDashboard" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-6">
              <div className="font-bold text-[17px] mb-[6px] dark:text-gray-100">تتبع الشحنة · NX-24817</div>
              <div className="text-[13px] text-[var(--color-muted)] dark:text-gray-400 mb-[22px]">متوقع الوصول اليوم بين ٤ و ٧ مساءً</div>
              <div>
                {tracking.map((ele, index) => (
                  <div key={index} className="grid grid-cols-[22px_1fr] gap-[14px]">
                    <div className="flex flex-col items-center">
                      <div
                        style={{ backgroundColor: ele.dot, borderColor: ele.ring }}
                        className="w-[13px] h-[13px] rounded-full border-[3px] shrink-0"
                      ></div>
                      <div
                        style={{ backgroundColor: ele.line }}
                        className="flex-1 w-[2px] min-h-[34px]"
                      ></div>
                    </div>
                    <div className="pb-2">
                      <div style={{ color: ele.fg }} className="text-sm font-semibold dark:!text-gray-200">
                        {ele.title}
                      </div>
                      <div className="text-[12.5px] text-[var(--color-muted)] dark:text-gray-400 mt-[3px]">{ele.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--color-green-dark)] dark:bg-[#0f2e25] border border-transparent dark:border-[#22332e] text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg">
              <div>
                <div className="text-[var(--color-gold)] text-[12.5px] tracking-[.1em] mb-[10px] font-bold">نقاط الولاء</div>
                <div className="font-extrabold text-4xl text-[var(--color-gold)]">١٬٢٤٠</div>
                <div className="text-[13.5px] text-[#A7BBB2] dark:text-gray-300 mt-2 leading-[1.8]">تعادل ١٢٤ ر.س تقدر تستخدمها في طلبك الجاي.</div>
              </div>
              <div className="mt-5 border border-[var(--color-gold)]/40 text-[var(--color-gold)] text-center py-3 rounded-[11px] text-sm cursor-pointer hover:bg-[var(--color-gold)]/10 font-bold transition duration-200">
                استبدال النقاط
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}