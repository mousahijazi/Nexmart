import Link from "next/link";
import { HeaderNavItems } from "../../index";

export default function Header() {
  return (
    <header className="sticky top-0 z-100 w-full shadow-xl dark:shadow-black/70 bg-white dark:bg-zinc-900 px-7">
      <div className="flex h-20 items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-gray-800 dark:text-[#F5EBE6]">
            ⬡ Nexmart
        </Link>
        
        <HeaderNavItems />
      </div>
    </header>
  )
}
