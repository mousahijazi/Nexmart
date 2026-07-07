import { useUserContext } from "@/Context/UserProvider";
import Link from "next/link";

export default function LoginButton() {    
    const {logout, user, loading} = useUserContext();

  return (
    <>
        {loading 
          ? <div className="w-24 h-10 bg-gray-200 rounded-full" />
          : user?.accessToken 
              ? <button className="cursor-pointer px-7 py-3 text-center bg-red-600 text-white rounded-full font-medium hover:opacity-90 transition" onClick={logout}>
                  <span>logout</span>
                </button>
              : <Link href="/login" className="cursor-pointer px-7 py-3 text-center bg-[#5B3A21] text-white rounded-full font-medium hover:opacity-90 transition">
                  <span>login</span>
                </Link>
        }
    </>
  )
}
