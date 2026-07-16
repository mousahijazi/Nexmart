"use client";
import Link from "next/link";
import { UserImage, LogoutButton } from "@/index";
import { useUserContext } from "@/Context/UserProvider";

export default function AuthSection() {
  const { user, loading } = useUserContext();

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="h-[60px] w-[60px] shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-zinc-700" />
        <div className="hidden h-12 w-[117px] animate-pulse rounded-full bg-gray-200 dark:bg-zinc-700 sm:block" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      {!user 
        ? <>
            <Link
                href="/auth?mode=login"
                className="text-sm font-medium px-4 text-[#5B3A21] transition hover:opacity-80 dark:text-[#A68A64]"
            >
                Login
            </Link>
            <Link
                href="/auth?mode=register"
                className="rounded-2xl bg-[#5B3A21] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
                Register
            </Link>
          </> 
        : <>
            <Link href="/user">
                <UserImage />
            </Link>
            <LogoutButton />
          </>
      }
    </div>
  );
}