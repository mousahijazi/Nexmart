"use client";
import { useRef, useEffect } from "react";
import NavLink from "./NavLink";
import {Icon, NavSearch} from "@/index";

export default function Nav({isOpen, setIsOpen, buttonRef}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && menuRef.current && !menuRef.current.contains(event.target) && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div 
      ref={menuRef}
      className={`
        ${isOpen ? "flex" : "hidden"}
        lg:flex
        flex-col
        absolute lg:static
        top-24 max-[500px]:top-40 left-0
        w-full lg:w-auto
        max-lg:bg-[var(--color-cream)]
        shadow-xl dark:shadow-black/60 lg:shadow-none
        items-center gap-6
        py-6 lg:py-0
        z-50
    `}>
        <NavLink />
        
        {/*todo*/}
        <div className="max-md:flex flex-col hidden justify-center w-full pt-4 border-t-2 border-t-gray-400 dark:border-t-[#A68A64]">
          <div className="px-8 pb-4">
            <NavSearch />
          </div>
          <Icon />
        </div>
    </div>
  )
}
