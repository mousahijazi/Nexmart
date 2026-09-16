import { Dashbaord, ProtectedRoute } from "@/index";

export default function Page() {
  return (
    <ProtectedRoute allowedRole="ADMIN">
      <main className="px-6">
        <div className="mx-auto max-w-7xl">
          <Dashbaord showData="adminDashboard" />
        </div>
      </main>
    </ProtectedRoute>
  );
}