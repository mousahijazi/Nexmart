import ProductRow from "./ProductRow";

export default function ProductTable({ products, selected, onToggleActive }) {
  return (
    <section className="grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-[14px] border border-[var(--color-border)] bg-[var(--color-cream)]">
      <div className="min-w-0 overflow-x-auto scrollbar-thin">
        <div className="min-w-[950px] w-full">
          <div className="grid grid-cols-[minmax(280px,1.5fr)_110px_110px_90px_110px_90px] items-center bg-[var(--color-surface)] px-4 py-3 text-[9px] font-semibold uppercase tracking-[0.08em] text-[var(--color-soft)]">
            <div>Product Detail</div>
            <div>Category</div>
            <div>Brand</div>
            <div>Unit Price</div>
            <div>Stock Level</div>
            <div>Catalog Status</div>
          </div>

          {products.length > 0 ? (
            products.map((product) => (
              <ProductRow
                key={product._id}
                product={product}
                onToggleActive={onToggleActive}
                selected={selected.includes(product._id)}
              />
            ))
          ) : (
            <div className="flex min-h-[180px] items-center justify-center text-[12px] text-[var(--color-muted)]">
              No products found.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}