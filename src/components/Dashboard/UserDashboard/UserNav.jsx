export default function UserNav() {
    const accountNav = [
        { label: "لوحة الحساب", badge: "" },
        { label: "طلباتي", badge: "٥" },
        { label: "المفضلة", badge: "٤" },
        { label: "عناويني", badge: "" },
        { label: "طرق الدفع", badge: "" },
        { label: "المرتجعات", badge: "" },
        { label: "الإعدادات", badge: "" },
    ];

  return (
    <div>
        {accountNav.map((ele, index) => (
            <div key={index} className="flex items-center justify-between px-[13px] py-[11px] rounded-[11px] text-sm cursor-pointer mb-[3px] hover:bg-black/5 dark:hover:bg-[#121a17] dark:text-gray-200 transition duration-200">
            <span>{ele.label}</span>
            {ele.badge && (
                <span className="bg-[var(--color-gold)] text-[var(--color-green-dark)] text-[11px] font-bold rounded-full px-2 py-[1px]">{ele.badge}</span>
            )}
            </div>
        ))}
    </div>
  )
}
