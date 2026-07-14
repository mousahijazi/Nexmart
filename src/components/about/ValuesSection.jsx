import { Values } from "./data";

export default function ValuesSection() {
  return (
    <section className="bg-white dark:bg-zinc-900/40 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 flex flex-col gap-4">
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Our Values
          </h2>
          <p className="max-w-md text-gray-600 dark:text-[#e5ded8]">
            The principles behind every decision we make.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {Values.map(({ icon: Icon, title, description }, index) => (
            <div key={index} className="rounded-3xl bg-[#F7F4EF] p-8 transition-all duration-300 hover:-translate-y-2 shadow-lg dark:shadow-black/60 hover:shadow-xl dark:bg-zinc-950">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5B3A21] text-[#fcfbf9] transition-colors duration-300 dark:bg-amber-200/90 dark:text-zinc-950">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                {title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}