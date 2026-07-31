import { CheckoutForm, CheckoutData, CheckoutItems, CheckoutStepper, PaymentForm, PaymentSummary } from "@/index"

export default async function page({searchParams}) {
  const resolvedParams = await searchParams;
  const mode = resolvedParams?.mode || "address";
  const isAddress = mode === "address";

  return (
    <div className="min-h-screen bg-[#F2f2f2] dark:bg-zinc-800 flex flex-col justify-center px-3 min-[480px]:px-6 py-32 min-[480px]:py-40">
      <CheckoutStepper isAddress={isAddress} />
      <div className="mx-auto w-full max-w-7xl min-[480px]:bg-white min-[480px]:dark:bg-zinc-950 min-[480px]:rounded-2xl overflow-hidden min-[480px]:shadow-md">
          {isAddress ? (
              <>
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                      <CheckoutForm />
                      <CheckoutData />
                  </div>

                  <CheckoutItems />
              </>
          ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2">
                  <PaymentForm />
                  <PaymentSummary />
              </div>
          )}
      </div>  
    </div>
  )
}
