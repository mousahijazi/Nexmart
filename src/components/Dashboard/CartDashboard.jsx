import { Button, BuyButton, Text, DashboardData, ClearCartButton } from "@/index";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function CartDashboard() {
    const t = useTranslations();

  return (
    <div className="bg-white dark:bg-zinc-950 shadow-lg py-12 px-6 rounded-2xl grid grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center items-start gap-7">
            <div className="">
                <span className="text-xs font-bold tracking-widest text-[#5B3A21]/80 dark:text-[#A68A64] uppercase mb-1">
                    {t("cart.cartDashboard.title")}
                </span>
                <h1 className="text-2xl min-[480px]:text-3xl md:text-4xl font-extrabold text-[#5B3A21] dark:text-[#F5EBE6] tracking-tight">
                    {t("cart.cartDashboard.Desc")}
                </h1>
            </div>
            <DashboardData />
            <div className="flex max-sm:flex-col w-full items-center gap-5">
                <BuyButton products={true} />
                <ClearCartButton />   
            </div>
        </div>

        <div className="relative flex flex-col justify-end items-center max-lg:mt-12">
            <Text />
            <div className="absolute -top-14 lg:top-1/12">
                <Image 
                    src="/cart.svg"
                    alt="shoping cart"
                    width={250}
                    height={250}
                    className="opacity-10 dark:opacity-40"
                />
            </div>
            <Button title={t("cart.cartDashboard.button")} link="products" />
        </div>
    </div>
  )
}
