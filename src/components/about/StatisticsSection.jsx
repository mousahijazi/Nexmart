import { Star } from "lucide-react";
import { Stats } from "./data";

export default function StatisticsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:py-28">
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-4 gap-6">
        {Stats.map((stat) => (
          <div key={stat.label} className="flex flex-col items-center gap-3 rounded-3xl p-8 transition-all duration-300 hover:-translate-y-2 shadow-md hover:shadow-xl dark:shadow-none bg-white dark:bg-zinc-900">
            {stat.value === "rating" ? (
              <div className="flex gap-1 text-[#5B3A21] dark:text-amber-200/90">
                {[...Array(5)].map((ele, index) => (
                    <Star key={index} className="h-6 w-6" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
            ) : (
              <span className="text-3xl font-semibold text-[#5B3A21] dark:text-amber-200/90 sm:text-4xl">
                {stat.value}
              </span>
            )}
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}