"use client";
import { useState } from "react";
import { useUserContext } from "@/Context/UserProvider";
import { UpdateUser, LogoutButton } from "@/index";
import { User, ShieldCheck, Edit2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SettingsDashboard() {
    const { user } = useUserContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const metadata = user?.user_metadata || {};
    const tLabel = useTranslations();
    const t = useTranslations("profile");
    const tSettings = useTranslations("profile.settingsDashboard");

    const profileData = [
        {
            label: tLabel("auth.form.firstName.label"),
            value: metadata?.first_name,
        },
        {
            label: tLabel("auth.form.lastName.label"),
            value: metadata?.last_name,
        },
        {
            label: tSettings("phone"),
            value: metadata?.phone,
        },
        {
            label: tLabel("auth.form.email.label"),
            value: metadata?.email,
        },
    ];

    return (
        <div className="flex flex-col gap-5">
            <div className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-6">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#EEF4F1] dark:bg-[#122A23] flex items-center justify-center">
                        <User size={20} className="text-[var(--color-green-dark)] dark:text-[var(--color-gold)]" />
                    </div>
                    <div>
                        <h1 className="font-bold text-xl dark:text-gray-100">
                            {tSettings("title")}
                        </h1>
                        <p className="text-xs text-[var(--color-muted)] dark:text-gray-400 mt-1">
                            {tSettings("subtitle")}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h2 className="font-bold text-[17px] dark:text-gray-100">
                        {tSettings("personalInfoTitle")}
                    </h2>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="
                            flex items-center gap-2
                            px-4 py-2
                            rounded-xl
                            border border-[var(--color-border)] dark:border-[#22332e]
                            bg-[#FAF9F4] dark:bg-[#121a17]
                            text-xs font-semibold
                            text-[#0E4D3A] dark:text-[var(--color-gold)]
                            hover:bg-[#EEF4F1] dark:hover:bg-[#122A23]
                            transition cursor-pointer
                        "
                    >
                        <Edit2 size={14} />
                        <span>{tSettings("edit")}</span>
                    </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {profileData.map((ele, index) => (
                        <div key={index} className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-[var(--color-muted)] dark:text-gray-400">
                                {ele.label}
                            </span>
                            <p className="text-sm font-medium dark:text-gray-100 bg-[#FAF9F4] dark:bg-[#121a17] p-3 rounded-xl border border-[var(--color-border)] dark:border-[#22332e]">
                                {ele.value || t("notSpecified")}
                            </p>
                        </div>
                    ))}
                </div>
                <UpdateUser isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
            </div>

            <div className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-6">
                <div className="flex flex-wrap items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF4F1] dark:bg-[#122A23] flex items-center justify-center">
                        <ShieldCheck size={19} className="text-[var(--color-green-dark)] dark:text-[var(--color-gold)]" />
                    </div>
                    <div>
                        <h2 className="font-bold text-[17px] dark:text-gray-100">
                            {tSettings("securityTitle")}
                        </h2>
                        <p className="text-xs text-[var(--color-muted)] dark:text-gray-400 mt-1">
                            {tSettings("securitySubtitle")}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-t border-[var(--color-divider)] dark:border-[#22332e]">
                    <div>
                        <p className="text-sm font-semibold dark:text-gray-200">
                            {tSettings("emailAccountLabel")}
                        </p>

                        <p className="text-xs text-[var(--color-muted)] dark:text-gray-400 mt-1">
                            {tSettings("emailLinkedDesc", { email: metadata.email || "" })}
                        </p>
                    </div>
                    <span className="text-xs font-bold text-[#0E4D3A] dark:text-[var(--color-gold)]">
                        {tSettings("protected")}
                    </span>
                </div>
            </div>

            <div className="bg-white dark:bg-[#18221f] border border-[#E8D6D2] dark:border-[#3A211F] rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div>
                        <h2 className="font-bold text-[17px] text-[#713B35] dark:text-[#E7A39C]">
                            {tSettings("logoutTitle")}
                        </h2>

                        <p className="text-xs text-[var(--color-muted)] dark:text-gray-400 mt-1">
                            {tSettings("logoutSubtitle")}
                        </p>
                    </div>

                    <LogoutButton />
                </div>
            </div>
        </div>
    );
}