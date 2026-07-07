"use client"
import Image from "next/image";
import { Icons } from "@/index";
import { useState } from "react";

export default function Product({data}) {
    const [selectedImage, setSelectedImage] = useState(data.thumbnail);

  return (
    <div className="flex flex-col justify-center items-center gap-5">
        <div className="rounded-2xl grid sm:grid-cols-[1fr_auto] gap-4">
            <Image 
                src={selectedImage}
                alt={data.title}
                width={500}
                height={500}
                priority
                className="bg-[#F2F2F2] rounded-2xl"
            />
            <div className="flex gap-2 sm:flex-col justify-between">
                <Icons />
            </div>
        </div>
        <div className="grid grid-cols-2 w-full justify-center justify-items-center gap-5 min-[480]:flex lg:justify-center max-[480]:border-b-[3px] max-[480]:border-dashed max-[480]:border-b-[#666] max-[480]:pb-6">
            {data.images.map((ele, index) => (
                <div key={index} className="flex-1 max-w-44">
                    <Image 
                        key={index}
                        src={ele}
                        alt={data.title}
                        width={120}
                        height={120}
                        className="
                        w-full h-auto
                        bg-[#F2F2F2] 
                        p-2 rounded-2xl 
                        cursor-pointer 
                        shadow-sm 
                        hover:shadow-lg hover:scale-105 
                        transition duration-200"
                        onClick={() => setSelectedImage(ele)}
                    />
                </div>
            ))}
        </div>
    </div>
  )
}
