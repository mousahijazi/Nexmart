"use client";
import { useUserContext } from "@/Context/UserProvider";
import { UserImage } from "@/index";
import { useLocale } from "next-intl";

export default function UserProfileInfo() {
  const locale = useLocale();
  const { user, loading } = useUserContext();
  const userName = user?.user_metadata?.first_name
    ? `${user?.user_metadata.first_name} ${user?.user_metadata.last_name}`
    : "guest";

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const joinedDate = user?.created_at ? formatDate(user.created_at) : "غير محدد";

  if (loading) {
    return (
      <div className="animate-pulse flex items-center gap-3 pb-[18px] border-b border-[var(--color-divider)] dark:border-[#22332e] mb-[14px]">
        <div className="shrink-0 w-11 h-11 rounded-full bg-gray-200 dark:bg-[#2a3b34]" />

        <div>
          <div className="w-24 h-5 text-[15px] rounded-md bg-gray-200 dark:bg-[#2a3b34]" />
          <div className="w-16 h-4 text-xs rounded-md bg-gray-200 dark:bg-[#2a3b34] mt-1.5" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 pb-[18px] border-b border-[var(--color-divider)] dark:border-[#22332e] mb-[14px]">
      <UserImage />
      <div>
        <div className="font-semibold text-[15px] dark:text-gray-100">{userName}</div>
        <div className="text-xs text-gray-600 dark:text-gray-400">{joinedDate}</div>
      </div>
    </div>
  );
}