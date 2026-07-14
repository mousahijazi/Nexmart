import {data} from "./data";

export default function Card() {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map(({ icon: Icon, title, Desc }, index) => (
            <div key={index} className="bg-white dark:bg-zinc-950 p-8 rounded-3xl shadow-md dark:shadow-black/60 duration-300 hover:shadow-xl hover:-translate-y-4">
                <div className="flex items-center justify-center gap-2">
                    <Icon className="h-6 w-6 text-[#A68A64] dark:text-[#5B3A21]" />
                    <h3 className="font-bold text-[#5B3A21] dark:text-[#F5EBE6] text-xl">
                        {title}
                    </h3>
                </div>
                <p className="text-gray-500 dark:text-[#e5ded8] mt-2">
                    {Desc}
                </p>
            </div>
        ))}
    </div>
  )
}
