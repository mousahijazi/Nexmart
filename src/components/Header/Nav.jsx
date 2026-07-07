"use client";
import NavLink from "./NavLink";
import {Icon} from "@/index";

export default function Nav({isOpen}) {
  return (
    <div className={`
        ${isOpen ? "flex" : "hidden"}
        md:flex
        flex-col
        absolute md:static
        top-24 left-0
        w-full md:w-auto
        bg-white
        shadow-xl md:shadow-none
        items-center gap-6
        py-6 md:py-0
        z-50
    `}>
        <NavLink />
        
        {/*todo*/}
        <div className="flex sm:hidden justify-center w-full pt-4 border-t-2 border-t-gray-400">
            <Icon />
        </div>
    </div>
  )
}
