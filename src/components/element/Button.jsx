import { Link } from "@/lib/i18n/routing";

export default function Button({link, title = "shop now"}) {
  return (
    <Link
        href={`/${link}`}
        className="rounded-xl bg-[var(--color-gold)] text-[var(--color-green-dark)] font-bold px-[34px] py-[15px] text-[15px] hover:bg-[var(--color-gold-light)]"
    >
        <span>{title}</span>
    </Link>
  )
}
