"use client";
import { useState } from "react";
import { User, ShieldCheck, LogOut } from "lucide-react";
import { useUserContext } from "@/Context/UserProvider";
import { UpdateUser, LogoutButton, EditProfileButton } from "@/index";
import { useTranslations } from "next-intl";

export default function SettingsDashboard({ role = "user" }) {
  const { user } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tLabel = useTranslations();
  const t = useTranslations("profile");
  const tSettings = useTranslations("profile.settingsDashboard");

  const isAdmin = role === "admin";

  const profileData = [
    {
      label: tLabel("auth.form.firstName.label"),
      value: user?.firstName,
    },
    {
      label: tLabel("auth.form.lastName.label"),
      value: user?.lastName,
    },
    {
      label: tSettings("phone"),
      value: user?.phoneNumber,
    },
    {
      label: tLabel("auth.form.email.label"),
      value: user?.email,
    },
  ];

  const content = isAdmin
    ? {
        title: "Admin Settings",
        subtitle: "Manage your administrator account and profile settings.",

        personalInfoTitle: "Personal Information",
        personalInfoSubtitle: "Update the information associated with your administrator account.",

        securityTitle: "Security",
        securitySubtitle: "Security information for your administrator account.",

        emailAccountLabel: "Email Account",
        emailLinkedDesc: "Your administrator account is linked to your email address.",

        protected: "Protected",

        logoutTitle: "Sign Out",
        logoutSubtitle: "Sign out of your administrator account.",
      }
    : {
        title: tSettings("title"),
        subtitle: tSettings("subtitle"),

        personalInfoTitle: tSettings("personalInfoTitle"),
        personalInfoSubtitle:
          tSettings("personalInfoSubtitle"),

        securityTitle: tSettings("securityTitle"),
        securitySubtitle: tSettings("securitySubtitle"),

        emailAccountLabel: tSettings("emailAccountLabel"),
        emailLinkedDesc: tSettings("emailLinkedDesc", { email: user?.email || "" }),

        protected: tSettings("protected"),

        logoutTitle: tSettings("logoutTitle"),
        logoutSubtitle: tSettings("logoutSubtitle"),
      };

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 dark:border-[#22332e] dark:bg-[#18221f]">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4F1] dark:bg-[#122A23]">
            <User size={20} className="text-[var(--color-green-dark)] dark:text-[var(--color-gold)]" />
          </div>

          <div>
            <h1 className="text-xl font-bold dark:text-gray-100">
              {content.title}
            </h1>
            <p className="mt-1 text-xs text-[var(--color-muted)] dark:text-gray-400">
              {content.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 dark:border-[#22332e] dark:bg-[#18221f]">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-[17px] font-bold dark:text-gray-100">
              {content.personalInfoTitle}
            </h2>
            <p className="mt-1 text-xs text-[var(--color-muted)] dark:text-gray-400">
              {content.personalInfoSubtitle}
            </p>
          </div>

          <EditProfileButton onClick={() => setIsModalOpen(true)} label="Edit" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {profileData.map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-[var(--color-muted)] dark:text-gray-400">
                {item.label}
              </span>

              <p className="rounded-xl border border-[var(--color-border)] bg-[#FAF9F4] p-3 text-sm font-medium dark:border-[#22332e] dark:bg-[#121a17] dark:text-gray-100">
                {item.value || t("notSpecified")}
              </p>
            </div>
          ))}
        </div>

        <UpdateUser isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 dark:border-[#22332e] dark:bg-[#18221f]">
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EEF4F1] dark:bg-[#122A23]">
            <ShieldCheck size={19} className="text-[var(--color-green-dark)] dark:text-[var(--color-gold)]" />
          </div>

          <div>
            <h2 className="text-[17px] font-bold dark:text-gray-100">
              {content.securityTitle}
            </h2>
            <p className="mt-1 text-xs text-[var(--color-muted)] dark:text-gray-400">
              {content.securitySubtitle}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-divider)] py-4 dark:border-[#22332e]">
          <div>
            <p className="text-sm font-semibold dark:text-gray-200">
              {content.emailAccountLabel}
            </p>
            <p className="mt-1 text-xs text-[var(--color-muted)] dark:text-gray-400">
              {content.emailLinkedDesc}
            </p>
          </div>

          <span className="text-xs font-bold text-[#0E4D3A] dark:text-[var(--color-gold)]">
            {content.protected}
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-[#E8D6D2] bg-white p-6 dark:border-[#3A211F] dark:bg-[#18221f]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F9ECEA] dark:bg-[#2A1715]">
              <LogOut size={18} className="text-[#713B35] dark:text-[#E7A39C]" />
            </div>

            <div>
              <h2 className="text-[17px] font-bold text-[#713B35] dark:text-[#E7A39C]">
                {content.logoutTitle}
              </h2>
              <p className="mt-1 text-xs text-[var(--color-muted)] dark:text-gray-400">
                {content.logoutSubtitle}
              </p>
            </div>
          </div>

          <LogoutButton />
        </div>
      </div>
    </div>
  );
}