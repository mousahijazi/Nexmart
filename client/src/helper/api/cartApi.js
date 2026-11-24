import { apiFetch, readApiJson } from "../apiFetch";

export async function fetchCartPricing(items, coupon = "", signal) {
  const response = await apiFetch("/api/v1/cart/price", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items,
      coupon,
    }),
    signal,
  });

  const payload = await readApiJson(response);

  if (!payload?.data) {
    throw new Error("Invalid cart pricing response");
  }

  return payload.data;
}