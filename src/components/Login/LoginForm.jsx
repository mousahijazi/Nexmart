"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/Context/UserProvider";
import { useAlertContext } from "@/Context/AlertProvider";
import { loginUser } from "@/helper/fetchApi";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
    // router
    const router = useRouter(); 

    // context
    const { setUser, user } = useUserContext();
    const {showAlert} = useAlertContext();

    // state
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const userData = await loginUser(username, password);
        if (!userData?.accessToken) {
            showAlert("Invalid username or password", "danger");
            return;
        }
        if (user?.accessToken) {
            showAlert("You are already logged in", "danger");
            return;
        } 

        setUser(userData);
        showAlert(`Welcom Back ${userData.firstName}`);

        setTimeout(() => {
            router.replace("/");
        }, 1200);
    };

  return (
    <form onSubmit={handleLogin} className="mt-10 grid grid-cols-1 md:grid-cols-1 min-[560px]:grid-cols-2 gap-5">
        <div>
            <label className="block mb-2 text-sm font-semibold text-[#5B3A21]">
                Username
            </label>

            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="
                    w-full
                    text-[#5B3A21]
                    font-semibold
                    px-4 py-3
                    rounded-xl
                    border-2 border-gray-200
                    outline-none
                    focus:border-[#5B3A21]
                    transition
                "
            />
        </div>

        <div className="relative">
            <label className="block mb-2 text-sm font-semibold text-[#5B3A21]">
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
                    text-[#5B3A21]
                    font-semibold
                    rounded-xl
                    border-2 border-gray-200
                    outline-none
                    focus:border-[#5B3A21]
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
