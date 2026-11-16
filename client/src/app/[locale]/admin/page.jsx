import { Dashbaord, ProtectedRoute } from "@/index";

export const metadata = {
  title: "Nexmart - Admin profile",
  description: "Nexmart is your go-to online store for the best products at unbeatable prices. Fast shipping, secure checkout, and a seamless shopping experience.",
};

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