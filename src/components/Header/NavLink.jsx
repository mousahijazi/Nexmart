import Link from "next/link";
import { data } from "./data";

export default function NavLink() {
  return (
     <ul className="flex flex-col lg:flex-row items-center gap-6">
      {data.map((ele, index) => (
        <li key={index}>
          <Link
            href={ele.link}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-[#D4C7BC] dark:hover:text-[#A68A64] transition-colors"
          >
            {ele.text}
          </Link>
        </li>
      ))}
    </ul>
  )
}
