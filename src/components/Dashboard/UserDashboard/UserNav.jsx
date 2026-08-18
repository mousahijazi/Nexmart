"use client"
import { useUserContext } from "@/Context/UserProvider";
import { useCheckoutContext } from "@/Context/CheckoutProvider";
import { useWishlistContext } from "@/Context/WishlistProvider";
import { useTranslations } from "next-intl";

export default function UserNav() {
    const t = useTranslations("profile.nav");
    const { setActiveTab } = useUserContext();
    const { orders } = useCheckoutContext();
    const { wishlist } = useWishlistContext();

    const returnedCount = orders.filter(
        (order) => order.payment_status === "failed"
    ).length;

    const accountNav = [
        { id: "dashboard", label: t("dashboard"), badge: "" },
        { id: "orders", label: t("orders"), badge: orders.length },
        { id: "wishlist", label: t("wishlist"), badge: wishlist.length },
        { id: "addresses", label: t("addresses"), badge: "" },
        { id: "payments", label: t("payments"), badge: "" },
        { id: "returns", label: t("returns"), badge: returnedCount },
        { id: "settings", label: t("settings"), badge: "" },
    ];

    return (
        <div>
            {accountNav.map((ele, index) => (
                <button 
                    key={index} 
                    type="button" 
                    className="cursor-pointer w-full flex items-center justify-between px-[13px] py-[11px] rounded-[11px] text-sm mb-[3px] hover:bg-black/5 dark:hover:bg-[#121a17] dark:text-gray-200 transition duration-200"
                    onClick={() => setActiveTab(ele.id)}
                >
                    <span>{ele.label}</span>
                    {ele.badge !== "" && (
                        <span className="bg-[var(--color-gold)] text-[var(--color-green-dark)] text-[11px] font-bold rounded-full px-2 py-[1px]">
                            {ele.badge}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}