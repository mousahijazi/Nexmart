import { Wallet, Truck, ShoppingBag, Users2, Boxes, Clock3, PauseCircle } from "lucide-react";

export const heroStats = [
  { icon: Wallet, label: "Daily GMV", value: "SAR 348,920 (+14.8%)" },
  { icon: Truck, label: "Fulfillment SLA", value: "99.4% On-Time" },
  { icon: ShoppingBag, label: "Active Cart Sessions", value: "1,842 Users" },
];

export const getOverviewStats = ({ usersCount = 0, productsTotal = 0, ordersStats = {} } = {}) => [
  {
    icon: ShoppingBag,
    label: "Total Orders",
    value: Number(ordersStats.total ?? 0).toLocaleString("en-US"),
    trend: {
      tone: "positive",
      text: "All registered orders",
    },
  },
  {
    icon: Clock3,
    label: "Pending Orders",
    value: Number(ordersStats.pending ?? 0).toLocaleString("en-US"),
    trend: {
      tone: "warning",
      text: "Awaiting payment",
    },
  },
  {
    icon: PauseCircle,
    label: "Orders On Hold",
    value: Number(ordersStats.onHold ?? 0).toLocaleString("en-US"),
    trend: {
      tone: "warning",
      text: "Awaiting admin review",
    },
  },
  {
    icon: Boxes,
    label: "Total Products",
    value: Number(productsTotal).toLocaleString("en-US"),
    trend: {
      tone: "positive",
      text: "Products in catalog",
    },
  },
  {
    icon: Users2,
    label: "Registered Users",
    value: Number(usersCount).toLocaleString("en-US"),
    trend: {
      tone: "positive",
      text: "Loaded user records",
    },
  },
];