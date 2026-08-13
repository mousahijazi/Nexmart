import { Link } from "@/lib/i18n/routing";
import { data } from "./data";
import { useTranslations } from "next-intl";

export default function NavLink() {
  const t = useTranslations();

  return (
     <ul className="flex items-center gap-6">
      {data.map((ele, index) => (
        <li key={index}>
          <Link
            href={ele.link}
            className="text-sm text-gray-600 hover:text-gray-900 dark:text-[#D4C7BC] dark:hover:text-[#A68A64] transition-colors"
          >
            {t(ele.text)}
          </Link>
        </li>
      ))}
    </ul>
  )
}
