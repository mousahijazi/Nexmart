import { redirect } from "next/navigation";
import { getServerUser } from "@/lib/server/auth";
import { getLocale } from "next-intl/server";

export default async function ProtectedRoute({ children, allowedRole, redirectTo = "/auth?mode=login" }) {
  const user = await getServerUser();
  const locale = await getLocale();

  if (!user) {
    redirect(`/${locale}${redirectTo}`);
  }

  if (allowedRole && user.role !== allowedRole) {
    redirect(`/${locale}/user`);
  }

  return children;
}