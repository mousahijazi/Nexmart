export function getStockStatus(stock) {
  if (!stock || stock <= 0) return "Out of Stock";
  if (stock <= 10) return "Low Stock";
  return "In Stock";
}

export function getCatalogStatus(isActive) {
  return isActive ? "Active" : "Draft";
}

export function getCategoryName(product) {
  return product.category?.name?.en || "Uncategorized";
}

export function getBrandName(product) {
  return product.brand?.name?.en || "No Brand";
}

export function getDisplaySku(product) {
  return product._id ? product._id.slice(-6).toUpperCase() : "N/A";
}
