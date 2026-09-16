import { OverviewPanel, RecentOrdersPanel } from "@/index";

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
        <OverviewPanel />
        <RecentOrdersPanel />
    </div>
  )
}
