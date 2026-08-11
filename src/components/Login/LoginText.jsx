import { LoginForm } from "@/index";
import { useTranslations } from "next-intl";

export default function LoginText({isLogin}) {
  const t = useTranslations();

  return (
    <div className="px-2 min-[480px]:py-12 min-[480px]:px-6 sm:p-10 flex flex-col justify-center">
        <span className="text-xs font-bold tracking-widest uppercase text-[#5B3A21]/80 dark:text-[#A68A64]/70">
          {isLogin ? t("auth.login.title") : t("auth.register.title")}
        </span>
        <h1 className="mt-3 max-[360px]:text-[21px] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#5B3A21] dark:text-[#A68A64]">
          {isLogin ? t("auth.login.secondTitle") : t("auth.register.title")}
        </h1>
        <p className="max-[360px]:text-sm mt-3 text-gray-500 dark:text-[#e5ded8]">
          {isLogin ? t("auth.login.Desc") : t("auth.register.Desc")}
        </p>

        <LoginForm isLogin={isLogin} />
    </div>
  )
}
