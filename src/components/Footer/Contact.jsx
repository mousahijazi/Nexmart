import Image from "next/image";
import { ContactData } from "./data";

export default function Contact() {
  return (
    <div className="flex flex-col gap-8">
        <div>
            <h1 className="font-semibold text-gray-800 mb-4">Address</h1>
            <p className="text-sm text-gray-600">
                📍 Gaza, Palestine
            </p>
        </div>
        <div>
            <h1 className="font-semibold text-gray-800 mb-4">Contact</h1>
            <div className="flex flex-col gap-2">
                {ContactData.map((ele, index) => (
                    <p key={index} className="text-sm text-gray-600 flex items-center gap-2 flex-wrap ">
                        <Image 
                            src={ele.url}
                            alt={ele.alt}
                            width={24}
                            height={24}
                        />
                        {ele.text}
                    </p>
                ))}
            </div>
        </div>
    </div>
  )
}
