import { Star } from "lucide-react";
import { Stats } from "./data";

export default function StatisticsSection() {
  return (
    <section className="mx-auto max-w-7xl">
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-6">
        {Stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-3 rounded-3xl p-6 sm:p-8 min-h-[140px] transition-all duration-300 hover:-translate-y-2 shadow-md hover:shadow-xl dark:shadow-none bg-gradient-to-b from-[#E8CFAE] to-[#B98555]">
            {stat.value === "rating" ? (
              <div className="flex gap-1 text-[#9A641F] dark:text-amber-200/90">
                {[...Array(5)].map((ele, index) => (
                    <Star key={index} className="h-6 w-6" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
            ) : (
              <span className="text-3xl font-semibold text-[#4A2F1D] dark:text-amber-200/90 sm:text-4xl">
                {stat.value}
              </span>
            )}
            <span className="text-sm text-[#5B3A21] font-bold dark:text-zinc-200">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}