"use client"
import { useState, useRef } from "react";
import { Nav, Icon } from "@/index";
import { Menu } from "lucide-react";

export default function HeaderNavItems() {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null)
  
  return (
    <>
      <Nav isOpen={isOpen} setIsOpen={setIsOpen} buttonRef={buttonRef} />

      {/* todo */}
      <div className="hidden md:flex">
        <Icon />
      </div>
      
      <button 
          className="block lg:hidden cursor-pointer"
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
      >
          <Menu size={60} strokeWidth={3} className="dark:text-[#f1f1f1]" />
      </button>
    </>
  )
}
