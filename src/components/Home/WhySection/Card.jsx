import {data} from "./data";

export default function Card() {
  return (
    <div className="mt-12 grid gap-8 md:grid-cols-3">
        {data.map((ele, index) => (
            <div key={index} className="bg-white p-8 rounded-3xl shadow-md duration-300 hover:shadow-xl hover:-translate-y-4">
                <h3 className="font-bold text-[#5B3A21] text-xl">
                    {ele.title}
                </h3>
                <p className="text-gray-500 mt-2">
                    {ele.Desc}
                </p>
            </div>
        ))}
    </div>
  )
}
