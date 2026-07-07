export default function TextCart() {
  return (
    <div className="mb-16 pb-4 border-b border-[#5B3A21]/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
            <span className="text-xs font-bold tracking-widest text-[#5B3A21]/80 uppercase mb-1 ">
                Shopping Cart
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#5B3A21] tracking-tight">
                Shopping Cart
            </h1>
        </div>
        <p className="text-sm text-gray-600 md:max-w-3/5 md:text-right">
            Manage your items, update quantities, or remove products from your cart.
        </p>
    </div>
  )
}
