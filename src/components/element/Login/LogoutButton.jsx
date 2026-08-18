import { useUserContext } from "@/Context/UserProvider";
import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LogoutButton() {
    const t = useTranslations();
    const {logout, user} = useUserContext();

  return (
    user && (
        <button
            onClick={logout}
            className="
                flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-xl
                border
                border-[#D8BDB8]
                dark:border-[#58332E]
                text-[#8D4038]
                dark:text-[#E7A39C]
                hover:bg-[#F8ECEA]
                dark:hover:bg-[#2A1B19]
                font-bold
                text-sm
                cursor-pointer
                transition
            "
            aria-label="logout"
        >
            <LogOut size={18} />
            {t("nav.logout")}
        </button>
    )
  )
}
