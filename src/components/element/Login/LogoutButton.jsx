import { useUserContext } from "@/Context/UserProvider";

export default function LogoutButton() {
    const {logout, user} = useUserContext();

  return (
    user && (
        <button
            onClick={logout}
            className="
            bg-red-600
            text-white
            px-8 py-3
            rounded-2xl
            hover:opacity-90
            transition
            cursor-pointer
            "
        >
            Logout
        </button>
    )
  )
}
