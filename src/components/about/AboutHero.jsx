import { HeroImage } from "@/index";

export default function AboutHero() {
  return (
    <section className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-12 py-28 lg:py-32 px-6">
      <div className="flex flex-col gap-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#5B3A21]/80 dark:text-[#EDE0D4]/80">
          About Nexmart
        </span>
        <h1 className="pb-2 pt-1 bg-gradient-to-b from-[#5B3A21] dark:from-[#A68A64] dark:to-[#EDE0D4] to-[#A68A64] bg-clip-text text-transparent text-3xl min-[360px]:text-4xl sm:text-5xl lg:text-6xl font-extrabold flex flex-col gap-1.5">
            <span>Built around quality,</span>
            <span>trust and simplicity.</span>
        </h1>
        <p className="max-w-lg text-gray-600 dark:text-[#e5ded8] sm:text-lg leading-relaxed">
          Nexmart is a modern shopping experience designed for people who
          value their time. Every product, every page and every detail is
          crafted to feel effortless.
        </p>

        <div className="flex items-center gap-4 pt-2">
          <div className="h-px w-12 bg-[#5B3A21]/80 dark:bg-[#A68A64]/90" />
          <span className="text-sm text-gray-600 dark:text-zinc-400">
            Since 2026
          </span>
        </div>
      </div>

      {/* todo */}
      <HeroImage />
    </section>
  );
}