"use client"
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoriesButton, CategoriesCard } from "@/index";

export default function CategoriesSlider({categories}) {
    const [currentPage, setCurrentPage] = useState(0);
    const visibleCategories = categories.slice(currentPage * 6, currentPage * 6 + 6);
    const totalPages = Math.ceil(categories.length / 6);

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    }
    
    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    }

  return (
    <>
        <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[14px]">
            <CategoriesCard categories={visibleCategories} />
        </div>
        <div dir="ltr" className="mt-10 flex items-center justify-center gap-6">
            <CategoriesButton action={prevPage} ariaLabel="Previous categories" icon={<ChevronLeft className="h-5 w-5" />} />
            <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => {
                    const isActive = index === currentPage;

                    return (
                    <button
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        aria-label={`Go to page ${index + 1}`}
                        className={`h-2.5 cursor-pointer rounded-full transition-all duration-300 ${
                        isActive
                            ? "w-7 bg-[var(--color-green)] dark:bg-[var(--color-gold)]"
                            : "w-2.5 bg-[var(--color-field)] hover:bg-[var(--color-muted-3)] dark:bg-[var(--color-border)] dark:hover:bg-[var(--color-muted-2)]"
                        }`}
                    />
                    );
                })}
            </div>
            <CategoriesButton action={nextPage} ariaLabel="Next categories" icon={<ChevronRight className="h-5 w-5" />} />
        </div>
    </>
  )
}
