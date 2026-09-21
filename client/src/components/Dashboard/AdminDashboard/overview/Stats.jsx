import { Wallet, Truck, ShoppingBag, Package2, Users2, Boxes } from "lucide-react";

export const heroStats = [
  { key: "gmv", icon: Wallet, label: "Daily GMV", value: "SAR 348,920 (+14.8%)" },
  { key: "sla", icon: Truck, label: "Fulfillment SLA", value: "99.4% On-Time" },
  { key: "cart", icon: ShoppingBag, label: "Active Cart Sessions", value: "1,842 Users" },
];

export const getOverviewStats = (usersCount = 0) => [
  {
    key: "revenue",
    icon: Wallet,
    label: "Total Platform Revenue",
    value: "SAR 3,842,950",
    trend: { tone: "positive", text: "+18.2% vs last mo." },
  },
  {
    key: "orders",
    icon: Package2,
    label: "Total Active Orders",
    value: "1,428 Orders",
    trend: { tone: "warning", text: "14 Pending" },
  },
  {
    key: "users",
    icon: Users2,
    label: "Registered Users & Sellers",
    value: `${usersCount.toLocaleString("en-US")} Accounts`,
    trend: { tone: "positive", text: "Active Database" },
  },
  {
    key: "catalog",
    icon: Boxes,
    label: "Catalog & Active SKUs",
    value: "18,920 Products",
    trend: { tone: "negative", text: "12 Low Stock" },
  },
];