import { LayoutGrid, ShoppingCart, Boxes, Tags, Package, Users, Receipt, BadgePercent, BarChart3, Settings } from "lucide-react";

export const QuickNavItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutGrid },
  { key: "all-orders", label: "All Orders", icon: ShoppingCart },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "categories", label: "Categories", icon: Tags },
  { key: "products", label: "Products", icon: Package },
  { key: "customers", label: "Customers", icon: Users },
  { key: "settlements", label: "Settlements", icon: Receipt },
  { key: "deals", label: "Deals & Promos", icon: BadgePercent },
  { key: "reports", label: "Reports & SLA", icon: BarChart3 },
  { key: "settings", label: "Settings", icon: Settings },
];