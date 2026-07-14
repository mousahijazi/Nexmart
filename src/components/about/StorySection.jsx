import { Milestones } from "./data";

export default function StorySection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:py-24">
      <div className="mb-16 flex flex-col gap-4">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Our Story
        </h2>
        <p className="max-w-md text-gray-600 dark:text-[#e5ded8]">
          A short path, made of clear decisions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
        {Milestones.map((milestone, index) => (
          <div key={index} className="relative flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-semibold bg-[#5B3A21] text-[#fcfbf9] dark:bg-amber-200/90 dark:text-zinc-950">
                {index + 1}
              </div>
              {index < Milestones.length - 1 && (
                <div className="hidden lg:block flex-1 border-t border-dashed border-zinc-300 dark:border-zinc-700" />
              )}
            </div>

            <div className="rounded-2xl p-6 bg-[#fffcfc] dark:bg-zinc-950 dark:lg:bg-zinc-900">
              <span className="text-sm font-semibold text-[#5B3A21] dark:text-amber-200/80">
                {milestone.year}
              </span>
              <h3 className="mt-2 text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {milestone.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {milestone.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}