import { Search, ChevronDown, Zap} from "lucide-react";

function SelectBox({ value, options, onChange }) {
  return (
    <div className="relative flex h-[40px] min-w-0 items-center rounded-[9px] bg-[var(--color-surface)]">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-full w-full cursor-pointer appearance-none bg-transparent px-3 pr-9 text-[11px] font-medium text-[var(--color-soft)] outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-soft)]">
        <ChevronDown />
      </div>
    </div>
  );
}

export default function ProductFilters({ search, setSearch, category, setCategory, brand, setBrand, stock, setStock, categories, brands, stockOptions }) {
  return (
    <section className="mb-4 rounded-[14px] border border-[var(--color-border)] bg-[var(--color-cream)] p-3.5 sm:p-4">
      <div className="grid grid-cols-1 gap-2.5 min-[1200px]:grid-cols-[minmax(260px,1.3fr)_minmax(150px,0.8fr)_minmax(150px,0.8fr)]">
        <label className="relative block min-w-0">
          <span className="sr-only">Search products</span>

          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]">
            <Search />
          </span>

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search SKU, product title (EN/AR), brand..."
            className="h-[40px] w-full rounded-[9px] bg-[var(--color-surface)] pl-9 pr-3 text-[11px] text-[var(--color-ink)] outline-none placeholder:text-[var(--color-muted)] focus:ring-1 focus:ring-[var(--color-gold)]"
          />
        </label>

        <SelectBox value={category} options={categories} onChange={setCategory} />

        <SelectBox value={brand} options={brands} onChange={setBrand} />
      </div>

      <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:w-[63%]">
        <SelectBox value={stock} options={stockOptions} onChange={setStock} />

        <div className="relative flex h-[40px] min-w-0 items-center rounded-[9px] bg-[var(--color-surface)]">
          <div className="absolute left-3 text-[var(--color-soft)]">
            <Zap />
          </div>

          <select className="h-full w-full cursor-pointer appearance-none bg-transparent pl-9 pr-9 text-[11px] font-medium text-[var(--color-soft)] outline-none">
            <option>Bulk Actions</option>
            <option>Update Stock</option>
            <option>Change Category</option>
            <option>Change Status</option>
          </select>

          <div className="pointer-events-none absolute right-3">
            <ChevronDown />
          </div>
        </div>
      </div>
    </section>
  );
}