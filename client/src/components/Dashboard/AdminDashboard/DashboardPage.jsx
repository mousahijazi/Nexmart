import { OverviewPanel, Dashbaord } from "@/index";

export default function DashboardPage() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <OverviewPanel />
      <Dashbaord showData="orderDashboard" />
    </div>
  );
}