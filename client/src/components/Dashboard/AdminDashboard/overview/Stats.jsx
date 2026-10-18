import { Wallet, Truck, ShoppingBag, Package2, Users2, Boxes } from "lucide-react";

export const heroStats = [
  { icon: Wallet, label: "Daily GMV", value: "SAR 348,920 (+14.8%)" },
  { icon: Truck, label: "Fulfillment SLA", value: "99.4% On-Time" },
  { icon: ShoppingBag, label: "Active Cart Sessions", value: "1,842 Users" },
];

export const getOverviewStats = (usersCount = 0) => [
  {
    icon: Wallet,
    label: "Total Platform Revenue",
    value: "SAR 3,842,950",
    trend: { tone: "positive", text: "+18.2% vs last mo." },
  },
  {
    icon: Package2,
    label: "Total Active Orders",
    value: "1,428 Orders",
    trend: { tone: "warning", text: "14 Pending" },
  },
  {
    icon: Users2,
    label: "Registered Users & Sellers",
    value: `${usersCount.toLocaleString("en-US")} Accounts`,
    trend: { tone: "positive", text: "Active Database" },
  },
  {
    icon: Boxes,
    label: "Catalog & Active SKUs",
    value: "18,920 Products",
    trend: { tone: "negative", text: "12 Low Stock" },
  },
];