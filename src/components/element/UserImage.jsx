import Image from "next/image";
import { useUserContext } from "@/Context/UserProvider";

export default function UserImage() {
    const {user} = useUserContext();

  return (
    <Image
        src={user?.image || `/Profile.jpg`}
        alt={user?.firstName || "Guest"}
        width={60}
        height={60}
        className="rounded-full bg-gray-400 dark:border dark:border-zinc-300 cursor-pointer"
    />
  )
}
