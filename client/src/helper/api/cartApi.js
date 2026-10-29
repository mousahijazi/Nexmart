const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCartPricing(items, coupon = "", signal) {
  const response = await fetch(`${API_URL}/api/v1/cart/price`, {
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

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || "Failed to calculate cart pricing");
  }

  if (!payload?.data) {
    throw new Error("Invalid cart pricing response");
  }

  return payload.data;
}