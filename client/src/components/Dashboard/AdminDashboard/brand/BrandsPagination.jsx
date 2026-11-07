export default function BrandsPagination({ brandsPage, setBrandsPage, brandsLimit, setBrandsLimit, brandsTotalPages, brandsTotal, pageNumbers }) {
  const startItem = brandsTotal === 0 ? 0 : (brandsPage - 1) * brandsLimit + 1;
  const endItem = Math.min(brandsPage * brandsLimit, brandsTotal);

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-divider)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[10px] text-[var(--color-soft)]">
        Showing {startItem} - {endItem} of {brandsTotal} brands
      </p>

      <div className="flex items-center gap-1">

        <button
          type="button"
          disabled={brandsPage <= 1}
          onClick={() => setBrandsPage((current) => Math.max(1, current - 1))}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] text-[var(--color-soft)] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--color-sand)]"
        >
          ‹
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            type="button"
            onClick={() => setBrandsPage(number)}
            aria-current={ brandsPage === number ? "page" : undefined }
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-semibold ${
              brandsPage === number
                ? "bg-[var(--color-green-dark)] text-white"
                : "text-[var(--color-soft)] hover:bg-[var(--color-sand)]"
            }`}
          >
            {number}
          </button>
        ))}

        <button
          type="button"
          disabled={ brandsTotalPages === 0 || brandsPage >= brandsTotalPages}
          onClick={() => setBrandsPage((current) => Math.min(brandsTotalPages, current + 1))}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] text-[var(--color-soft)] disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[var(--color-sand)]"
        >
          ›
        </button>

      </div>

      <div className="flex items-center gap-2 text-[10px] text-[var(--color-soft)]">
        <span>Rows per page:</span>

        <select
          value={brandsLimit}
          onChange={(event) => {
            setBrandsLimit(Number(event.target.value));
            setBrandsPage(1);
          }}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-1 text-[10px] outline-none"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
  );
}