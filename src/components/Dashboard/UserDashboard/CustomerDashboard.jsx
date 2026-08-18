"use client"
import { Dashbaord, StatsSection, AccountDashboard, SettingsDashboard, LatestOrderTracking } from "@/index";
import { useUserContext } from "@/Context/UserProvider";
import { useTranslations } from "next-intl";

export default function CustomerDashboard() {
    const { activeTab } = useUserContext();
    const t = useTranslations("profile.loyaltyPoints");

    const renderDashboard = () => {
        switch (activeTab) {
            case "dashboard":
                return <AccountDashboard />;

            case "orders":
                return <Dashbaord showData="orderDashboard" />;

            case "wishlist":
                return <h4>wishlist</h4>;

            case "addresses":
                return <h2>address</h2>;

            case "payments":
                return <h1>payment</h1>;

            case "returns":
                return <p>return</p>;

            case "settings":
                return <SettingsDashboard />;

            default:
                return <h3>Mousa</h3>;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <StatsSection />

            <div className="contents">
                {renderDashboard()}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <LatestOrderTracking />            

                <div className="bg-[var(--color-green-dark)] dark:bg-[#0f2e25] border border-transparent dark:border-[#22332e] text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg">
                    <div>
                        <div className="text-[var(--color-gold)] text-[12.5px] tracking-[.1em] mb-[10px] font-bold">
                            {t("title")}
                        </div>
                        <div className="font-extrabold text-4xl text-[var(--color-gold)]">
                            {t("points")}
                        </div>
                        <div className="text-[13.5px] text-[#A7BBB2] dark:text-gray-300 mt-2 leading-[1.8]">
                            {t("description")}
                        </div>
                    </div>
                    <div className="mt-5 border border-[var(--color-gold)]/40 text-[var(--color-gold)] text-center py-3 rounded-[11px] text-sm cursor-pointer hover:bg-[var(--color-gold)]/10 font-bold transition duration-200">
                        {t("redeemButton")}
                    </div>
                </div>
            </div>
        </div>
    );
}