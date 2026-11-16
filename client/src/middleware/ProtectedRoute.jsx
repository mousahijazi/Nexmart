"use client";
import { useEffect, useState } from "react";
import { useUserContext } from "@/Context/UserProvider";
import { useRouter } from "@/lib/i18n/routing";
import PageSkeleton from "./PageSkeleton";

export default function ProtectedRoute({ children, allowedRole, redirectTo = "/auth?mode=login" }) {
  const router = useRouter();
  const { user, role, loading } = useUserContext();

  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setAuthorized(false);
      router.replace(redirectTo);
      return;
    }

    if (allowedRole && role !== allowedRole) {
      setAuthorized(false);
      router.replace("/user");
      return;
    }

    setAuthorized(true);
  }, [user, role, loading, allowedRole, redirectTo, router]);

  if (loading || !authorized) {
    return <PageSkeleton />;
  }

  return children;
}