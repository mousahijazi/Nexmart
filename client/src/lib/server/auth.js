import { cache } from "react";
import { cookies } from "next/headers";

export const getServerUser = cache(async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("nexmart-token")?.value;

    if (!token) return null;

    const backendUrl = process.env.BACKEND_API_URL;

    if (!backendUrl) {
      console.error("BACKEND_API_URL is not configured");
      return null;
    }

    const response = await fetch(
      `${backendUrl.replace(/\/$/, "")}/api/v1/users/me`,
      {
        method: "GET",
        headers: {
          Cookie: `nexmart-token=${token}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) return null;

    const result = await response.json();

    const user = result?.data?.user || result?.user || null;

    if (!user || !user._id) return null;

    return user;
  } catch (error) {
    console.error("getServerUser:", error);
    return null;
  }
});