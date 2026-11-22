import { Wallet, Truck, ShoppingBag, Users2, Boxes, Clock3, PauseCircle } from "lucide-react";

export const getHeroStats = (t) => [
  { icon: Wallet, label: t("hero.dailyGmvLabel"), value: t("hero.dailyGmvValue") },
  { icon: Truck, label: t("hero.fulfillmentSlaLabel"), value: t("hero.fulfillmentSlaValue") },
  { icon: ShoppingBag, label: t("hero.activeCartsLabel"), value: t("hero.activeCartsValue") },
];

export const getOverviewStats = ({ usersCount = 0, productsTotal = 0, ordersStats = {}, t, locale = "en" } = {}) => {
  const formatNumber = (num) => Number(num ?? 0).toLocaleString(locale === "ar" ? "ar-EG" : "en-US");

  return [
    {
      icon: ShoppingBag,
      label: t("overview.totalOrders"),
      value: formatNumber(ordersStats.total),
      trend: {
        tone: "positive",
        text: t("overview.totalOrdersTrend"),
      },
    },
    {
      icon: Clock3,
      label: t("overview.pendingOrders"),
      value: formatNumber(ordersStats.pending),
      trend: {
        tone: "warning",
        text: t("overview.pendingOrdersTrend"),
      },
    },
    {
      icon: PauseCircle,
      label: t("overview.onHoldOrders"),
      value: formatNumber(ordersStats.onHold),
      trend: {
        tone: "warning",
        text: t("overview.onHoldOrdersTrend"),
      },
    },
    {
      icon: Boxes,
      label: t("overview.totalProducts"),
      value: formatNumber(productsTotal),
      trend: {
        tone: "positive",
        text: t("overview.totalProductsTrend"),
      },
    },
    {
      icon: Users2,
      label: t("overview.registeredUsers"),
      value: formatNumber(usersCount),
      trend: {
        tone: "positive",
        text: t("overview.registeredUsersTrend"),
      },
    },
  ];
};