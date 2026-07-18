import { useUserContext } from "@/Context/UserProvider";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const {logout, user} = useUserContext();

  return (
    user && (
        <button
            onClick={logout}
            className="
                bg-red-600
                text-white
                flex gap-1 items-center
                px-8 py-3
                rounded-2xl
                hover:opacity-90
                transition
                cursor-pointer
            "
        >
            <LogOut size={18} />
            Logout
        </button>
    )
  )
}
