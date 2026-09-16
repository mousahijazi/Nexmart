import { Dashbaord } from "@/index";

export default function Page() {
  return (
    <main className="sm:px-6">
      <div className="mx-auto max-w-7xl px-6">
        <Dashbaord showData="adminDashboard" />
      </div>
    </main>
  );
}