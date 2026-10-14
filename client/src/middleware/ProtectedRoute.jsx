"use client";
import { useEffect } from "react";
import { useUserContext } from "@/Context/UserProvider";
import { useRouter } from "@/lib/i18n/routing";
import PageSkeleton from "./PageSkeleton";

export default function ProtectedRoute({ children, allowedRole, redirectTo = "/auth?mode=login" }) {
  const router = useRouter();
  const { user, role, loading } = useUserContext();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(redirectTo);
      return;
    }

    if (allowedRole && role !== allowedRole) {
      router.replace("/user");
    }
  }, [user, role, loading, allowedRole, redirectTo, router]);

  if (loading || !user) {
    return <PageSkeleton />;
  }

  if (allowedRole && role !== allowedRole) {
    return <PageSkeleton />;
  }

  return children;
}