"use client"
import { useState } from "react";

export default function ProductsFilter({data, search, setSearch, selectedCategory, setSelectedCategory, categories}) {
  const [isOpen, setIsOpen] = useState(false);
  const currentCategoryName = selectedCategory === "all" 
    ? "All Categories" 
    : categories.find(cat => cat.slug === selectedCategory)?.name || selectedCategory;

  return (
    <div className="max-w-7xl mx-auto px-6">
        <div className="text-[#5B3A21] font-bold flex flex-col md:flex-row justify-between items-center gap-4">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            placeholder={`Search among ${data.length} products...`}
            className={`
              w-full md:max-w-md
              rounded-xl
              bg-white
              px-5 py-3
              outline-none
              text-md
              sm:text-lg
              duration-300
              border-2 border-transparent
            focus:border-[#5B3A21]
            `}
          />
          
          <div className="relative w-full md:w-64">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full flex items-center justify-between bg-white text-[#5B3A21] font-bold px-5 py-3 rounded-xl border-2 border-transparent hover:border-[#5B3A21] shadow-sm transition duration-300"
            >
              <span>{currentCategoryName}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute right-0 left-0 mt-2 max-h-60 overflow-y-auto bg-white rounded-xl shadow-xl border border-gray-100 z-50 p-2 flex flex-col gap-1 transition-all duration-300">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    selectedCategory === "all" ? "bg-[#5B3A21] text-white" : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  All Categories
                </button>

                {categories.map((category) => (
                  <button
                    key={category.slug}
                    onClick={() => {
                      setSelectedCategory(category.slug);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      selectedCategory === category.slug ? "bg-[#5B3A21] text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
    </div>
  )
}
