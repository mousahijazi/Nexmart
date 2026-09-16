"use client"; 
import { Link } from "../../lib/i18n/routing"; 
import { UserImage } from "../../index"; 
import { useUserContext } from "../../Context/UserProvider"; 
import { useTranslations } from "next-intl"; 
 
export default function AuthSection() { 
  const t = useTranslations(); 
  const { handleAccountClick, user, loading } = useUserContext(); 
 
  if (loading) { 
    return ( 
      <div className="flex items-center gap-3"> 
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-gray-200 dark:bg-[#22332e]" /> 
      </div> 
    ); 
  } 
 
  return ( 
    <div className="flex items-center gap-3"> 
      {!user ? (
        <>
          <button
            type="button"
            onClick={() => handleAccountClick("/auth?mode=login")}
            className="cursor-pointer inline-block px-4 text-sm font-medium text-[var(--color-green-dark)] transition hover:opacity-80 dark:text-[var(--color-gold)]"
          >
            {t("nav.login")}
          </button>

          <button
            type="button"
            onClick={() => handleAccountClick("/auth?mode=register")}
            className="cursor-pointer inline-block rounded-2xl bg-[var(--color-green-dark)] px-8 py-3 text-sm font-medium text-white transition hover:opacity-90 dark:bg-[#16382e]"
          >
            {t("nav.register")}
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => handleAccountClick()}
          className="cursor-pointer border rounded-2xl border-[var(--color-muted)] flex items-center gap-5 px-3 py-1 transition-opacity duration-200 hover:opacity-80"
        >
          <UserImage />

          <p className="text-sm text-[var(--color-green-dark)] dark:text-[var(--color-gold)]">
            {t("nav.account")}
          </p>
        </button>
      )} 
    </div> 
  ); 
}