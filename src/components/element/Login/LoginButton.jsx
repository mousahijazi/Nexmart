import { useUserContext } from "@/Context/UserProvider";
import { LogoutButton } from "@/index";
import Link from "next/link";

export default function LoginButton() {    
    const {user, loading} = useUserContext();

  return (
    <>
        {loading 
          ? <div className="w-[117px] h-12 bg-gray-200 rounded-full" />
          : user?.accessToken 
              ? <LogoutButton />
              : <Link href="/login" className="cursor-pointer w-[117px]  px-7 py-3 text-center bg-[#5B3A21] text-white rounded-full font-medium hover:opacity-90 transition">
                  <span>login</span>
                </Link>
        }
    </>
  )
}
