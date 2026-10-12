import { daysBetween } from "@/components/Dashboard/AdminDashboard/shared/formatDate";

export const seasonStatusOptions = ["All Statuses", "Active", "Inactive"];
export const seasonTimingOptions = ["All Periods", "Current", "Upcoming", "Past"];

const rawSeasons = [
  {
    _id: "s1",
    nameEn: "Saudi National Day 94",
    nameAr: "اليوم الوطني السعودي ٩٤",
    icon: "flag",
    description: "Major nationwide celebration campaign highlighting Saudi heritage and national pride.",
    startDate: "2024-09-15",
    endDate: "2024-09-30",
    status: "active",
    timing: "current",
    offersCount: 12,
    offers: [
      { _id: "so1", name: "National Day Royal Oud Special", target: "Product Target: Royal Taif Rose EDP", discount: "25% OFF", status: "Active" },
      { _id: "so2", name: "Traditional Dallah Heritage Bundle", target: "Product Target: Traditional Engraved Dallah", discount: "SAR 120.00 OFF", status: "Active" },
      { _id: "so3", name: "Sadu Artisan Weave Homeware", target: "Category: Artisan Crafts", discount: "20% OFF", status: "Active" },
    ],
  },
  {
    _id: "s2",
    nameEn: "Ramadan Mubarak & Eid Al-Fitr 1446",
    nameAr: "رمضان المبارك وعيد الفطر",
    icon: "moon",
    description: "Ramadan and Eid gifting campaign across dates, fragrances and home essentials.",
    startDate: "2025-02-28",
    endDate: "2025-04-05",
    status: "active",
    timing: "upcoming",
    offersCount: 18,
    offers: [],
  },
  {
    _id: "s3",
    nameEn: "Summer Oasis Flash Deals",
    nameAr: "عروض واحة الصيف",
    icon: "sun",
    description: "Seasonal flash deals for summer lifestyle products.",
    startDate: "2024-06-15",
    endDate: "2024-07-31",
    status: "inactive",
    timing: "past",
    offersCount: 8,
    offers: [],
  },
  {
    _id: "s4",
    nameEn: "Back to University & School 2024",
    nameAr: "العودة للدراسة",
    icon: "graduation",
    description: "Back-to-school essentials campaign.",
    startDate: "2024-08-18",
    endDate: "2024-09-08",
    status: "inactive",
    timing: "past",
    offersCount: 0,
    offers: [],
  },
];

export const seasonsData = rawSeasons.map((season) => ({
  ...season,
  durationDays: daysBetween(season.startDate, season.endDate),
}));

export const seasonStats = {
  total: 8,
  plannedNextYear: 2,
  active: 2,
  upcoming: 3,
  withOffers: 7,
  withOffersPercent: 87.5,
};

export function getSeasonStatusLabel(season) {
  if (season.status === "active" && season.timing === "current") return "Active - Current";
  if (season.status === "active" && season.timing === "upcoming") return "Active (Upcoming)";
  if (season.status === "inactive" && season.timing === "past") return "Inactive (Expired)";
  return "Inactive";
}