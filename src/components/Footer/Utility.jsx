import Link from "next/link";
import { UtilityData } from "./data";

export default function Utility() {
  return (
    <div>
        <h1 className="font-semibold text-gray-800 mb-6">Utility</h1>
        <ul className="flex flex-col gap-3">
            {UtilityData.map((ele, index) => (
                <li key={index}>
                    <Link href={ele.link} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                        {ele.text}
                    </Link>
                </li>
            ))}
        </ul>
    </div>
  )
}
