"use client"
import { useState } from "react";
import { Nav, Icon } from "@/index";
import Image from "next/image";

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
          className="block md:hidden cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
      >
          <Image 
              src="/burger-menu.svg"
              alt="Menu"
              width={60}
              height={60}
          />
      </button>
    </>
  )
}
