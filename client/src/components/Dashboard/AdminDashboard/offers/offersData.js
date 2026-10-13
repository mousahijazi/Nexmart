export const offerStats = {
  total: 34,
  addedThisMonth: 4,
  active: 22,
  scheduled: 7,
  expired: 5,
};

export const offerStatusOptions = ["All Statuses", "Active", "Scheduled", "Expired", "Inactive"];
export const offerTargetOptions = ["All Targets", "Product", "Category"];

export function formatDiscount(discount, type) {
  return type === "percentage" ? `${discount}% OFF` : `SAR ${Number(discount).toFixed(2)} OFF`;
}