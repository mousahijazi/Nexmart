"use client"
import { useState } from "react";
import {useUserContext} from "@/Context/UserProvider";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/lib/schemas/paymentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { RHFerrors } from "@/index";
import { useTranslations, useLocale } from "next-intl";

export default function LoginForm({isLogin}) {
    const t = useTranslations();
    const locale = useLocale();
    const {login} = useUserContext();
    const {register, handleSubmit, formState: { errors, isSubmitting }} = useForm({resolver: zodResolver(registerSchema(isLogin))});
    const [showPassword, setShowPassword] = useState(false);
    let submitting = isSubmitting;
    
    const FormNameData = [
        {
            text: t("auth.form.firstName.label"),
            apiKey: "firstName",
            error: errors.firstName,
        },
        {
            text: t("auth.form.lastName.label"),
            apiKey: "lastName",
            error: errors.lastName,
        },
    ];

    const onSubmit = async (data) => {
        await login(data, isLogin);
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-10 grid grid-cols-1 items-end gap-3">
        {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FormNameData.map(({text, apiKey, error}, index) => {
                    return(
                            <div key={index}>
                                <label className="block mb-2 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                                    {text}
                                </label>
                                <input
                                    type="text"
                                    {...register(apiKey)}
                                    placeholder={t("auth.form.namePlaceholder", {text: text})}
                                    className="
                                        w-full
                                        text-[#5B3A21] dark:text-zinc-700
                                        dark:bg-[#f2f2f2]
                                        font-semibold
                                        px-4 py-3
                                        rounded-xl
                                        border-2 border-gray-200
                                        outline-none
                                        focus:border-[#5B3A21] dark:focus:border-zinc-700
                                        transition
                                    "
                                />
                                <RHFerrors errors={error} />
                            </div>
                    )
                })}
            </div>
        )}

        <div>
            <label className="block mb-2 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                {t("auth.form.email.label")}
            </label>
            <input
                type="text"
                {...register("email")}
                placeholder={t("auth.form.email.placeholder")}
                className="
                    w-full
                    text-[#5B3A21] dark:text-zinc-700
                    dark:bg-[#f2f2f2]
                    font-semibold
                    px-4 py-3
                    rounded-xl
                    border-2 border-gray-200
                    outline-none
                    focus:border-[#5B3A21] dark:focus:border-zinc-700
                    transition
                "
            />
        </div>
        <RHFerrors errors={errors.email} />

        <div className="relative">
            <label className="block mb-2 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                {t("auth.form.password.placeholder")}
            </label>
            <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder={t("auth.form.password.placeholder")}
                className="
                    w-full
                    px-4 py-3
                    text-[#5B3A21] dark:text-zinc-700
                    font-semibold
                    rounded-xl
                    dark:bg-[#f2f2f2]
                    border-2 border-gray-200
                    outline-none
                    focus:border-[#5B3A21] dark:focus:border-zinc-700
                    transition
                "
            />

            <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`
                        absolute
                        ${locale === "en" ? "right-5" : "left-5"}
                        top-2/3 -translate-y-1/2
                        cursor-pointer
                    `
                }
                aria-label={
                    showPassword
                        ? "Hide password"
                        : "Show password"
                }
            >
                {showPassword ? (<EyeOff size={27} />) : (<Eye size={27} />)}
            </button>
        </div>
        <RHFerrors errors={errors.password} />

        <button className="cursor-pointer px-7 py-3 text-center bg-[#5B3A21] text-white rounded-full font-medium hover:opacity-90 transition">
            {submitting ? "Processing..." : isLogin ? "Sign In" : "Sign Up" }
        </button>
    </form>
  )
}
