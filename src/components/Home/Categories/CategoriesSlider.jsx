"use client"
import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoriesButton } from "@/index";

export default function CategoriesSlider({categories}) {
    const [currentPage, setCurrentPage] = useState(0);
    const visibleCategories = categories.slice(currentPage * 4, currentPage * 4 + 4);
    const totalPages = Math.ceil(categories.length / 4);

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    }
    
    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    }

  return (
    <>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleCategories.map((category) => (
            <Link
                key={category.slug}
                href={`/products?category=${category.slug}`}
                className="cursor-pointer group flex h-32 items-center justify-center rounded-3xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#5B3A21]/5 hover:shadow-xl dark:bg-zinc-900 dark:hover:bg-[#A68A64]/10"
            >
                <span className="text-lg font-medium capitalize text-zinc-800 transition-colors duration-300 group-hover:text-[#5B3A21] dark:text-zinc-200 dark:group-hover:text-[#A68A64]">
                    {category.name}
                </span>
            </Link>
        ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-6">
            <CategoriesButton action={prevPage} ariaLabel="Previous categories" icon={<ChevronLeft className="h-5 w-5" />} />
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentPage(index)}
                    aria-label={`Go to page ${index + 1}`}
                    className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                    index === currentPage
                        ? "w-6 bg-[#5B3A21] dark:bg-[#A68A64]"
                        : "w-2.5 bg-gray-300 dark:bg-zinc-700"
                    }`}
                />
                ))}
            </div>
            <CategoriesButton action={nextPage} ariaLabel="Next categories" icon={<ChevronRight className="h-5 w-5" />} />
        </div>
    </>
  )
}
