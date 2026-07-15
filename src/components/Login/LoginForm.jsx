"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/Context/UserProvider";
import { useAlertContext } from "@/Context/AlertProvider";
import { loginUser } from "@/helper/fetchApi";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
    const router = useRouter(); 
    const { setUser, user } = useUserContext();
    const {showAlert} = useAlertContext();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const result = await loginUser(email, password);
        if (!result.success) {
            showAlert(result.message, "danger");
            return;
        }

        const loggedInUser = result.user;
        if (loggedInUser?.success) {
            showAlert("You are already logged in", "danger");
            return;
        } 

        const guestCart = JSON.parse(localStorage.getItem("cart-guest")) || [];
        const userCart = JSON.parse(localStorage.getItem(`cart-${loggedInUser.id}`)) || [];
        const mergedCart = [
            ...userCart, 
            ...guestCart.filter(guestItem => !userCart.some(userItem => userItem.id === guestItem.id))
        ];

        localStorage.setItem(`cart-${loggedInUser.id}`, JSON.stringify(mergedCart));
        localStorage.removeItem("cart-guest");

        setUser(loggedInUser);
        showAlert(`Welcom Back ${loggedInUser.email}`);

        setTimeout(() => {
            router.replace("/");
        }, 1200);
    };

  return (
    <form onSubmit={handleLogin} className="mt-10 grid grid-cols-1 md:grid-cols-1 min-[560px]:grid-cols-2 gap-5">
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
            <span>login</span>
        </button>
    </form>
  )
}
