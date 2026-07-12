export default function ProductsText({total}) {
  return (
    <div className="pb-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-3xl sm:text-5xl font-bold text-[#5B3A21] dark:text-[#F5EBE6]">
                Explore Our Products
            </h1>
            <div className="mt-4 text-gray-600 dark:text-[#e5ded8] flex flex-col">
                <span>
                    Browse through our collection and discover
                    products carefully selected for you.
                </span>
                <span className="text-[#8B5A2B] dark:text-[#A68A64] font-semibold">{total} products available</span>
            </div>
        </div>
    </div>
  )
}
