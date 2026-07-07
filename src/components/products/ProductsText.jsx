export default function ProductsText({total}) {
  return (
    <div className="pb-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
            <h1 className="text-3xl sm:text-5xl font-bold text-[#5B3A21]">
                Explore Our Products
            </h1>
            <div className="mt-4 text-gray-600 flex flex-col">
                <span>
                    Browse through our collection and discover
                    products carefully selected for you.
                </span>
                <span className="text-[#8B5A2B] font-semibold">{total} products available</span>
            </div>
        </div>
    </div>
  )
}
