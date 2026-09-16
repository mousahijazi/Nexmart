import { QuickNavRail, OverviewPanel, RecentOrdersPanel } from "@/index";

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 py-6 lg:flex-row">
      <QuickNavRail />

      <div className="flex flex-1 flex-col gap-6">
        <OverviewPanel />
        <RecentOrdersPanel />
      </div>
    </div>
  );
}