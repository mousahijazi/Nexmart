import Link from "next/link";
import { Skills, Socials } from "./data";
import AboutImage from "./AboutImage";

export default function DeveloperSection() {
  return (
    <section className="bg-white dark:bg-zinc-900/40 py-20 lg:py-28">
      <div className="mx-auto max-w-7xl grid grid-cols-1 items-center gap-12 px-6 md:grid-cols-2 lg:gap-20">
        <div className="hidden md:block relative aspect-square w-full max-w-md overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
          <AboutImage />
        </div>

        <div className="flex flex-col gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5B3A21] dark:text-amber-200/80">
            Meet the Developer
          </span>
          <div className="flex items-center gap-4">
                <div className="md:hidden relative h-14 w-14 shrink-0 overflow-hidden rounded-full border-2 border-[#5B3A21] dark:border-amber-200/80 shadow-md">
                    <AboutImage />
                </div>
                <h2 className="max-[360px]:text-2xl text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Mousa Hijazi
                </h2>
            </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-[#e5ded8]">
            <span>Frontend Developer</span>
            <span className="h-1 w-1 rounded-full bg-zinc-400 dark:text-[#e5ded8]" />
            <span>Palestine 🇵🇸</span>
          </div>
          
          <p className="max-w-md leading-relaxed text-zinc-600 dark:text-zinc-400">
            Nexmart was built as a learning project to master React, Next.js
            and Tailwind CSS, and to practice designing a real, production
            style ecommerce experience from the ground up.
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {Skills.map((skill, index) => (
              <span key={index} className="rounded-full bg-[#F7F4EF] px-4 py-2 text-sm font-semibold text-[#5B3A21] dark:bg-zinc-950 dark:text-amber-200/90">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-4">
            {Socials.map(({ icon: Icon, label, href }, index) => (
              <Link
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#5B3A21] text-[#fcfbf9] transition-all duration-300 hover:-translate-y-1 shadow-md dark:shadow-black/60 hover:shadow-xl dark:bg-amber-200/90 dark:text-zinc-950"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}