"use client" 
import Image from "next/image"; 
import { Icons } from "../../../index"; 
import { useState } from "react"; 
 
export default function Product({data}) { 
    const [selectedImage, setSelectedImage] = useState(data.image); 
 
  return ( 
    <div className="flex flex-col justify-center items-center gap-5"> 
        <div className="rounded-2xl grid sm:grid-cols-[1fr_auto] gap-4"> 
            <div className="relative w-full max-w-[2000px] aspect-square rounded-2xl overflow-hidden bg-white min-[480px]:bg-[#F1F1F1] dark:bg-[#121a17] border border-[var(--color-border)] dark:border-[#22332e]"> 
                <Image 
                    src={selectedImage} 
                    alt={data.title} 
                    fill 
                    priority 
                    className="object-cover" 
                /> 
            </div> 
 
            <div className="flex gap-2 sm:flex-col justify-between"> 
                <Icons product={data} /> 
            </div> 
        </div> 
        <div className="grid grid-cols-2 w-full justify-center justify-items-center gap-5 min-[480]:flex lg:justify-center max-[480px]:border-b-[3px] max-[480px]:border-dashed max-[480px]:border-b-[var(--color-border)] dark:max-[480px]:border-b-[#22332e] max-[480px]:pb-6"> 
            {data.images.map((ele, index) => ( 
                <button 
                    type="button" 
                    key={index} 
                    onClick={() => setSelectedImage(ele)} 
                    className={` 
                        relative 
                        w-full 
                        max-w-44 
                        aspect-square 
                        rounded-2xl 
                        bg-white 
                        min-[480px]:bg-[#F1F1F1] 
                        dark:bg-[#121a17] 
                        cursor-pointer 
                        border 
                        ${selectedImage === ele 
                            ? "border-[var(--color-gold)] ring-2 ring-[var(--color-gold)]/30" 
                            : "border-[var(--color-border)] dark:border-[#22332e]"
                        }
                        shadow-sm 
                        hover:shadow-md 
                        hover:scale-105 
                        transition 
                        duration-200 
                        overflow-hidden 
                    `} 
                > 
                    <Image 
                        src={ele} 
                        alt={data.title} 
                        fill 
                        sizes="176px" 
                        className="object-cover" 
                    /> 
                </button> 
            ))} 
        </div> 
    </div> 
  ) 
}