import Link from "next/link";

export default function Button(props) {
  return (
    <Link
        href={`/${props.link}`}
        className="inline-block mt-12 px-8 py-4 bg-[#5B3A21] text-white rounded-full font-medium hover:opacity-90 transition"
    >
        <span>{props.title}</span>
        <span className="ml-2">→</span>
    </Link>
  )
}
