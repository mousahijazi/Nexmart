import { CheckoutForm, CheckoutData, CheckoutItems, CheckoutStepper, Pay } from "@/index";
export const metadata = {
  title: "Nexmart - checkout",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

export default async function page({searchParams}) {
  const resolvedParams = await searchParams;
  const mode = resolvedParams?.mode || "address";
  const isAddress = mode === "address";

  return (
    <div className="min-h-screen flex flex-col justify-center px-3 min-[480px]:px-6 py-32 min-[480px]:py-40">
      <CheckoutStepper isAddress={isAddress} />
      <div className="mx-auto w-full max-w-7xl min-[480px]:bg-[var(--color-surface)] min-[480px]:dark:bg-[var(--color-cream)] min-[480px]:rounded-2xl overflow-hidden min-[480px]:shadow-md">
          {isAddress ? (
              <>
                  <div dir="ltr" className="grid grid-cols-1 lg:grid-cols-2">
                      <CheckoutForm />
                      <CheckoutData />
                  </div>
                  <CheckoutItems />
              </>
          ) : (
              <Pay />
          )}
      </div>  
    </div>
  )
}
