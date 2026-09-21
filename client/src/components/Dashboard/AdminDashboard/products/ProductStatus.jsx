export function CategoryBadge({ category }) {
  const classes = {
    "Oud & Perfumes": "bg-[#BDEEDB] text-[var(--color-green)]",
    "Gourmet Food": "bg-[#F7DEA5] text-[#765B18]",
    "Artisan Crafts": "bg-[#E0E1DA] text-[var(--color-soft)]",
    "Modest Wear": "bg-[#DCEAE3] text-[var(--color-green)]",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium leading-[1.1] ${
        classes[category] || "bg-[var(--color-surface)] text-[var(--color-soft)]"
      }`}
    >
      {category}
    </span>
  );
}

export function StockBadge({ status, stock }) {
  if (status === "Out of Stock") {
    return (
      <div className="inline-flex min-w-[77px] flex-col rounded-[7px] bg-[#F7D8D4] px-2 py-1.5 text-[10px] leading-[1.15] text-[var(--color-red)]">
        <span className="font-medium">Out of</span>
        <span className="font-medium">Stock</span>
        <span className="mt-0.5">(0 units)</span>
      </div>
    );
  }

  if (status === "Low Stock") {
    return (
      <div className="inline-flex min-w-[77px] flex-col rounded-[7px] bg-[#F8D36C] px-2 py-1.5 text-[10px] leading-[1.15] text-[#70500A]">
        <span className="font-medium">Low</span>
        <span className="font-medium">Stock</span>
        <span className="mt-0.5">({stock} units)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex min-w-[77px] flex-col rounded-[7px] bg-[#BDEEDB] px-2 py-1.5 text-[10px] leading-[1.15] text-[var(--color-green)]">
      <span className="font-medium">In</span>
      <span className="font-medium">Stock</span>
      <span className="mt-0.5">({stock} units)</span>
    </div>
  );
}

export function CatalogStatus({ status }) {
  if (status === "Draft") {
    return (
      <span className="inline-flex rounded-full bg-[#E1E2DD] px-3 py-1 text-[10px] font-semibold text-[var(--color-soft)]">
        Draft
      </span>
    );
  }

  return (
    <span className="inline-flex rounded-full bg-[var(--color-green-dark)] px-3 py-1 text-[10px] font-semibold text-white">
      Active
    </span>
  );
}