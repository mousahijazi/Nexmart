import { LoginForm } from "@/index";

export default function LoginText() {
  return (
    <div className="py-12 px-6 sm:p-10 flex flex-col justify-center">
        <span className="text-xs font-bold tracking-widest uppercase text-[#5B3A21]/80">
        Welcome Back
        </span>

        <h1 className="mt-3 max-[360px]:text-[21px] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#5B3A21]">
        Login To Your Account
        </h1>

        <p className="max-[360px]:text-sm mt-3 text-gray-500">
        Continue shopping and manage your cart with your account.
        </p>

        <LoginForm />
    </div>
  )
}
