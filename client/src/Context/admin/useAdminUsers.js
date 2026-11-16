"use client";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/helper/fetchApi";
import { useUserContext } from "../UserProvider";

export default function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  const { user, loading } = useUserContext();

  useEffect(() => {
    if (loading) return;

    if (!user || user.role !== "ADMIN") {
      setUsers([]);
      setUsersLoading(false);
      return;
    }

    let cancelled = false;

    async function fetchAllAppUsers() {
      setUsersLoading(true);

      try {
        const token = localStorage.getItem("nexmart-token");

        if (!token) {
          setUsers([]);
          return;
        }

        const result = await getAllUsers(token);

        if (!cancelled) {
          if (result.status === "success" && Array.isArray(result.users)) {
            setUsers(result.users);
          } else {
            setUsers([]);
          }
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch admin users:", error);
          setUsers([]);
        }
      } finally {
        if (!cancelled) {
          setUsersLoading(false);
        }
      }
    }

    fetchAllAppUsers();

    return () => {
      cancelled = true;
    };
  }, [user, loading]);

  return {
    users,
    usersCount: users.length,
    usersLoading,
  };
}
