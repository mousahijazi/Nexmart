import Link from "next/link";
import { LinkData } from "./data";
import { Text } from "@/index";

export default function ContactLink() {
  return (
    <>
        <div className="lg:col-span-5 space-y-8 bg-white dark:bg-zinc-900 p-8 rounded-3xl shadow-xl border border-stone-200/60 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-1 gap-6">
                <div className="flex flex-col gap-6">
                    {LinkData.map((ele, index) => (
                        <div className="flex items-start gap-4" key={index}>
                            <div className="p-3 bg-[#5B3A21]/10 dark:bg-[#A68A64]/10 rounded-xl text-[#5B3A21] dark:text-[#A68A64]">
                                {ele.icon}
                            </div>
                            <div className="">
                                <p className="font-semibold text-sm text-stone-500 dark:text-stone-400">{ele.title}</p>
                                <Link href={ele.link} className="hover:underline font-medium break-all sm:break-normal">{ele.text}</Link>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="hidden md:block">
                    <Text />
                </div>
            </div>
        </div>
    </>
  )
}
