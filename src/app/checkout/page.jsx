import { CheckoutForm, CheckoutData } from "@/index"

export default function page() {
  return (
    <div className="min-h-screen bg-[#F2f2f2] dark:bg-zinc-800 flex items-center justify-center px-3 min-[480px]:px-6 py-32 min-[480px]:py-40">
        <div className="w-full max-w-7xl min-[480px]:bg-white min-[480px]:dark:bg-zinc-950 min-[480px]:rounded-2xl overflow-hidden min-[480px]:shadow-md grid grid-cols-1 lg:grid-cols-2">
            <CheckoutForm />
            <CheckoutData />
        </div>
    </div>
  )
}
