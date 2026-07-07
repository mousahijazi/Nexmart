import Link from "next/link";
import { HeaderNavItems } from "../../index";

export default function Header() {
  return (
    <header className="w-full shadow-xl bg-white px-7">
      <div className="flex h-20 items-center justify-between">
        <Link href="/" className="text-3xl font-bold text-gray-800">
            ⬡ Nexmart
        </Link>
        
        <HeaderNavItems />
      </div>
    </header>
  )
}
