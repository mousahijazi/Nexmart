"use client"
import { useUserContext } from "@/Context/UserProvider";
import { UserImage } from "@/index";
import { useLocale } from "next-intl";

export default function UserProfileInfo() {
    const locale = useLocale();
    const {user, loading} = useUserContext();
    const userName = user?.user_metadata?.first_name ? `${user?.user_metadata.first_name} ${user?.user_metadata.last_name}` : "guest";
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
        <div className="flex items-center gap-3 pb-[18px] border-b border-[var(--color-divider)] dark:border-[#22332e] mb-[14px] animate-pulse">
            <div className="w-[45px] h-[45px] rounded-full bg-gray-200 dark:bg-[#22332e] shrink-0" />
            
            <div className="flex flex-col gap-1.5">
            <div className="h-[20px] w-32 bg-gray-200 dark:bg-[#22332e] rounded-md" />
            <div className="h-[16px] w-24 bg-gray-200 dark:bg-[#22332e] rounded-md" />
            </div>
        </div>
        );
    }

  return (
    <div className="flex items-center gap-3 pb-[18px] border-b border-[var(--color-divider)] dark:border-[#22332e] mb-[14px]">
        <UserImage />
        <div>
            <div className="font-semibold text-[15px] dark:text-gray-100">{userName}</div>
            <div className="text-xs text-[var(--color-muted)] dark:text-gray-400">{joinedDate}</div>
        </div>
    </div>
  )
}
