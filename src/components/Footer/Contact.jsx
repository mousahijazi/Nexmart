import { MapPin } from "lucide-react";
import { ContactData } from "./data";

export default function Contact() {
  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="font-semibold text-gray-800 dark:text-[#F5EBE6] mb-4">Address</h1>
            <p className="text-sm text-gray-600 dark:text-[#e5ded8] flex items-center gap-2">
                <MapPin size={18} strokeWidth={2.2} className="text-[#5B3A21] dark:text-[#A68A64]" />
                Gaza, Palestine
            </p>
        </div>
        <div>
            <h1 className="font-semibold text-gray-800 dark:text-[#F5EBE6] mb-4">Contact</h1>
            <div className="flex flex-col gap-2">
                {ContactData.map((ele, index) => (
                    <p key={index} className="text-sm text-gray-600 dark:text-[#e5ded8] flex items-center gap-2 flex-wrap">
                        <span className="text-[#5B3A21] dark:text-[#A68A64]">
                            {ele.icon}
                        </span>
                        {ele.text}
                    </p>
                ))}
            </div>
        </div>
    </div>
  )
}
