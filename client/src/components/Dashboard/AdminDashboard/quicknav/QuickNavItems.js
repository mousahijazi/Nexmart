import { LayoutGrid, ShoppingCart, Boxes, Tags, Flame, Sparkles, Package, Users, Receipt, BadgePercent, BarChart3, Settings, BadgeCheck } from "lucide-react";

export const QuickNavItems = [
  { key: "dashboard", translationKey: "dashboard", icon: LayoutGrid },
  { key: "all-orders", translationKey: "allOrders", icon: ShoppingCart },
  { key: "inventory", translationKey: "inventory", icon: Boxes },
  { key: "brand", translationKey: "brands", icon: BadgeCheck },
  { key: "categories", translationKey: "categories", icon: Tags },
  { key: "products", translationKey: "products", icon: Package },
  { key: "offers", translationKey: "offers", icon: Flame },
  { key: "seasons", translationKey: "seasons", icon: Sparkles },
  { key: "customers", translationKey: "customers", icon: Users },
  { key: "settlements", translationKey: "settlements", icon: Receipt },
  { key: "deals", translationKey: "deals", icon: BadgePercent },
  { key: "reports", translationKey: "reports", icon: BarChart3 },
  { key: "settings", translationKey: "settings", icon: Settings },
];
