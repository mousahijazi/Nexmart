import AdminProvider from "@/Context/Adminprovider";
import { AdminDashboardContent, QuickNavRail } from "@/index";

export default function AdminDashboard() {
  return (
    <AdminProvider>
      <div className="flex flex-col gap-6 py-6 min-w-0 lg:flex-row">
        <QuickNavRail />
        <AdminDashboardContent />
      </div>
    </AdminProvider>
  );
}