import Link from "next/link";
import { HeaderNavItems } from "../../index";

export default function Header() {
  return (
    <header className="absolute top-0 left-0 z-100 w-full bg-transparent px-7">
      <div className="flex h-20 items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-gray-800 dark:text-[#F5EBE6]">
            ⬡ Nexmart
        </Link>
        
        <HeaderNavItems />
      </div>
    </header>
  )
}
