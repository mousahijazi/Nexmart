"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/helper/fetchApi";

export default function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);

  useEffect(() => {
    async function fetchAllAppUsers() {
      const token = localStorage.getItem("nexmart-token");

      if (!token) {
        setUsersLoading(false);
        return;
      }

      const result = await getAllUsers(token);

      if (result.status === "success" && Array.isArray(result.users)) {
        setUsers(result.users);
      }

      setUsersLoading(false);
    }

    fetchAllAppUsers();
  }, []);

  return {
    users,
    usersCount: users.length,
    usersLoading,
  };
}