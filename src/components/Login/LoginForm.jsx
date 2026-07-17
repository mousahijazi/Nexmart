"use client"
import { useState } from "react";
import {useUserContext} from "@/Context/UserProvider";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm({isLogin}) {
    const {login, firstName, setFirstName, lastName, setLastName} = useUserContext();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);
    
    const FormNameData = [
        {
            text: "First Name",
            name: firstName,
            setName: setFirstName,
        },
        {
            text: "Last Name",
            name: lastName,
            setName: setLastName,
        },
    ];

    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const result = await login(email, password, isLogin);
        setSubmitting(false);
    };

  return (
    <form onSubmit={onSubmit} className="mt-10 grid grid-cols-1 items-end gap-5">
        {!isLogin && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {FormNameData.map(({text, name, setName}, index) => (
                    <div key={index}>
                        <label className="block mb-2 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                            {text}
                        </label>
                        <input
                            type="text"
                            placeholder={`Your ${text}`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                ))}
            </div>
        )}

        <div>
            <label className="block mb-2 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                Email
            </label>
            <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
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

        <div className="relative">
            <label className="block mb-2 text-sm font-semibold text-[#5B3A21] dark:text-[#A68A64]">
                Password
            </label>
            <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
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
                className="
                    absolute
                    right-5
                    top-2/3
                    -translate-y-1/2
                    cursor-pointer
                "
                aria-label={
                    showPassword
                        ? "Hide password"
                        : "Show password"
                }
            >
                {showPassword ? (<EyeOff size={27} />) : (<Eye size={27} />)}
            </button>
        </div>

        <button className="cursor-pointer px-7 py-3 text-center bg-[#5B3A21] text-white rounded-full font-medium hover:opacity-90 transition">
            {submitting ? "Processing..." : isLogin ? "Sign In" : "Sign Up" }
        </button>
    </form>
  )
}
