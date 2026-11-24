"use client";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/helper/fetchApi";
import { useUserContext } from "../UserProvider";

export default function useAdminUsers({ enabled = false } = {}) {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const { user, loading } = useUserContext();

  useEffect(() => {
    if (!enabled || loading) return;

    if (!user || user.role !== "ADMIN") {
      setUsers([]);
      setUsersLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAllAppUsers() {
      setUsersLoading(true);

      try {
        // todo
        const token = localStorage.getItem("nexmart-token");

        if (!token) {
          if (!cancelled) setUsers([]);
          return;
        }

        const result = await getAllUsers(token);

        if (!cancelled) {
          setUsers(
            result.status === "success" && Array.isArray(result.users)
              ? result.users
              : []
          );
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch admin users:", error);
          setUsers([]);
        }
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    }

    fetchAllAppUsers();

    return () => {
      cancelled = true;
    };
  }, [enabled, user, loading]);

  return {
    users,
    usersCount: users.length,
    usersLoading,
  };
}