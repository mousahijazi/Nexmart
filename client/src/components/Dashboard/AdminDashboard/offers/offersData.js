export const offerStats = {
  total: 34,
  addedThisMonth: 4,
  active: 22,
  scheduled: 7,
  expired: 5,
};

export const offerStatusOptions = ["All Statuses", "Active", "Scheduled", "Expired", "Inactive"];
export const offerTargetOptions = ["All Targets", "Product", "Category"];

export const offersData = [
  {
    _id: "o1",
    name: "National Day Royal Oud Special",
    code: "OFR-2024-OUD94",
    description: "Exclusive 25% discount commemorating Saudi National Day across premium Taif Rose perfume lines. Automated discount triggers at checkout for all verified accounts.",
    target: { type: "Product", name: "Royal Taif Rose EDP 100ml", fullName: "Royal Taif Rose EDP", image: null },
    discount: { type: "percentage", value: 25 },
    minBasket: 300,
    season: "Saudi National Day 94",
    startDate: "2024-09-15",
    endDate: "2024-09-25",
    redemptions: 1489,
    priority: "High Priority",
    status: "Active",
  },
  {
    _id: "o2",
    name: "Gourmet Medjool Ramadan Box Offer",
    code: "OFR-RAM-DAT01",
    description: "Special Ramadan gift box pricing on selected premium dates and confectionery.",
    target: { type: "Category", name: "Gourmet Dates & Confectionery", fullName: "Gourmet Dates & Confectionery", image: null },
    discount: { type: "fixed", value: 50 },
    minBasket: 200,
    season: "Ramadan & Eid Al-Fitr",
    startDate: "2025-03-01",
    endDate: "2025-04-10",
    redemptions: 0,
    priority: "Normal",
    status: "Scheduled",
  },
  {
    _id: "o3",
    name: "Summer Oasis Flash Sale",
    code: "OFR-SUM-FLS02",
    description: "Limited-time summer flash discount on selected lifestyle products.",
    target: { type: "Category", name: "Outdoor Essentials", fullName: "Outdoor Essentials", image: null },
    discount: { type: "percentage", value: 20 },
    minBasket: 150,
    season: "Summer Oasis",
    startDate: "2024-06-15",
    endDate: "2024-07-31",
    redemptions: 862,
    priority: "Normal",
    status: "Expired",
  },
];

export function formatDiscount(discount) {
  return discount.type === "percentage"
    ? `${discount.value}% OFF`
    : `SAR ${Number(discount.value).toFixed(2)} OFF`;
}