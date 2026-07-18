import Image from "next/image";
import { useUserContext } from "@/Context/UserProvider";

export default function UserImage() {
    const {user, isUploadingImage} = useUserContext();

  return (
    <div className="relative shrink-0">
      <Image
          src={user?.user_metadata?.image || `/Profile.jpg`}
          alt={user?.firstName || "Guest"}
          width={60}
          height={60}
          unoptimized
          className="rounded-full aspect-square shrink-0 object-cover bg-gray-400 dark:border dark:border-zinc-300 cursor-pointer"
      />
      {isUploadingImage && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-[1px]">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          </div>
        )}
    </div>
  )
}
