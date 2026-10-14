export const offerStats = {
  total: 34,
  addedThisMonth: 4,
  active: 22,
  scheduled: 7,
  expired: 5,
};

export const offerStatusOptions = ["All Statuses", "Active", "Scheduled", "Expired", "Inactive"];
export const offerTargetOptions = ["All Targets", "Product", "Category"];

export const offerGridCols = "grid-cols-[minmax(240px,1.6fr)_minmax(200px,1.3fr)_110px_170px_130px_100px_45px]";
export const offerTableMinWidth = "min-w-[1110px]";

export function formatDiscount(discount, type) {
  return type === "percentage" ? `${discount}% OFF` : `SAR ${Number(discount).toFixed(2)} OFF`;
}