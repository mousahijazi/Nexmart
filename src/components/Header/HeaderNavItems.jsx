"use client"
import { useState } from "react";
import { Nav, Icon } from "@/index";
import { Menu } from "lucide-react";

export default function HeaderNavItems() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Nav isOpen={isOpen}/>

      {/* todo */}
      <div className="hidden sm:flex">
        <Icon />
      </div>
      
      <button 
          className="block lg:hidden cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
      >
          <Menu size={60} strokeWidth={3} className="dark:text-[#f1f1f1]" />
      </button>
    </>
  )
}
