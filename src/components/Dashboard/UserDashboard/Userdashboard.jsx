import { UserProfileInfo, UserNav, CustomerDashboard } from "@/index";

export default function Userdashboard() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(220px,260px)_1fr] gap-5 items-start">
        <aside className="bg-white dark:bg-[#18221f] border border-[var(--color-border)] dark:border-[#22332e] rounded-2xl p-[22px] lg:sticky lg:top-[150px]">
          <UserProfileInfo />
          <UserNav />
        </aside>
        <CustomerDashboard />
      </div>
    </div>
  );
}