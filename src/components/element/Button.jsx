import { Link } from "@/lib/i18n/routing";

export default function Button({link, title = "shop now"}) {
  return (
    <Link
        href={`/${link}`}
        className="inline-block mt-5 px-8 py-4 bg-[#5B3A21] text-white rounded-full font-medium hover:opacity-90 transition"
    >
        <span>{title}</span>
    </Link>
  )
}
