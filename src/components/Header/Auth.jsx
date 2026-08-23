"use client"; 
import { Link } from "@/lib/i18n/routing"; 
import { UserImage } from "@/index"; 
import { useUserContext } from "@/Context/UserProvider"; 
import { useTranslations } from "next-intl"; 
 
export default function AuthSection() { 
  const t = useTranslations(); 
  const { user, loading } = useUserContext(); 
 
  if (loading) { 
    return ( 
      <div className="flex items-center gap-3"> 
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-[#22332e]" /> 
      </div> 
    ); 
  } 
 
  return ( 
    <div className="flex items-center gap-3"> 
      {!user  
        ? <> 
            <Link 
                href="/auth?mode=login" 
                className="inline-block text-sm font-medium px-4 text-[var(--color-green-dark)] transition hover:opacity-80 dark:text-[var(--color-gold)]" 
            > 
              {t("nav.login")} 
            </Link> 
            <Link 
                href="/auth?mode=register" 
                className="inline-block rounded-2xl bg-[var(--color-green-dark)] dark:bg-[#16382e] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90" 
            > 
              {t("nav.register")} 
            </Link> 
          </>  
        : <> 
            <Link href="/user"> 
                <UserImage /> 
            </Link> 
          </> 
      } 
    </div> 
  ); 
}