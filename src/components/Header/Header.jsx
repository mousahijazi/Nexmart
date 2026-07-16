import Link from "next/link";
import { HeaderNavItems } from "../../index";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 z-100 w-full bg-white dark:bg-zinc-900 shadow-lg dark:shadow-black/60 px-3 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex h-20 items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-gray-800 dark:text-[#F5EBE6]">
            ⬡ Nexmart
        </Link>
        
        <HeaderNavItems />
      </div>
    </header>
  )
}
