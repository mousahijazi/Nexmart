export function getStockStatus(stock) {
  if (!stock || stock <= 0) return "outOfStock";
  if (stock <= 10) return "lowStock";
  return "inStock";
}

export function getCatalogStatus(isActive) {
  return isActive ? "active" : "draft";
}

export function getCategoryName(product, locale = "en") {
  const name = product.category?.name;

  if (typeof name === "string") return name;

  return (name?.[locale] || name?.en || name?.ar || "");
}

export function getBrandName(product, locale = "en") {
  const name = product.brand?.name;

  if (typeof name === "string") return name;

  return (name?.[locale] || name?.en || name?.ar || "");
}

export function getDisplaySku(product) {
  return product._id ? product._id.slice(-6).toUpperCase() : "N/A";
}
