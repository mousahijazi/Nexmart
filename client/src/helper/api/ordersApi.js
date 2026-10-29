const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function orderApiRequest(path, { method = "GET", token, body, signal } = {}) {
  if (!token) {
    throw new Error("You must log in to manage orders");
  }

  const response = await fetch(`${API_URL}${path}`,
    {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
      signal,
    }
  );

  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error("The server returned an invalid response");
  }

  if (!response.ok) {
    throw new Error(payload?.message || payload?.data?.message || `Request failed with status ${response.status}`);
  }

  return payload?.data ?? payload;
}

export const getAdminOrders = ({ token, page = 1, limit = 10, search = "", orderStatus = "", paymentStatus = "" } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) {
    params.set("search", search.trim());
  }

  if (orderStatus) {
    params.set("orderStatus", orderStatus);
  }

  if (paymentStatus) {
    params.set("paymentStatus", paymentStatus);
  }

  return orderApiRequest(`/api/v1/admin/orders?${params.toString()}`, { token, method: "GET" });
};

export async function getBackendAdminOrderItems(orderId, token, { page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return orderApiRequest(`/api/v1/admin/orders/${encodeURIComponent(orderId)}/items?${params.toString()}`, { token });
}

export async function createBackendOrder({ token, shippingInfo, items, coupon }) {
  return orderApiRequest("/api/v1/orders", {
    method: "POST",
    token,
    body: {
      shippingInfo,
      items: items.map((item) => ({
        productId: item.productId ?? item._id,
        quantity: item.quantity || 1,
      })),

      coupon: coupon?.trim().toLowerCase() || "",
    },
  });
}

export async function getBackendMyOrders(token, { page = 1, limit = 10 } = {}) {
  return orderApiRequest(`/api/v1/orders/my?page=${page}&limit=${limit}`, { token });
}

export async function getBackendOrderById(orderId, token) {
  return orderApiRequest(`/api/v1/orders/${encodeURIComponent(orderId)}`, { token });
}

export async function getBackendOrderItems(orderId, token) {
  return orderApiRequest(`/api/v1/orders/${encodeURIComponent(orderId)}/items`, { token });
}

export async function updateBackendOrder(orderId, shippingInfo, token) {
  return orderApiRequest(`/api/v1/orders/${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      token,
      body: { shippingInfo },
    }
  );
}

export async function replaceBackendOrderItems(orderId, items, coupon, token) {
  return orderApiRequest(
    `/api/v1/orders/${encodeURIComponent(orderId)}/items`,
    {
      method: "PATCH",
      token,
      body: {
        items: items.map((item) => ({
          productId:
            typeof item.product === "object"
              ? item.product._id
              : item.productId ?? item.product ?? item._id,
          quantity: item.quantity,
        })),
        coupon: coupon?.trim().toLowerCase() || "",
      },
    }
  );
}

export async function cancelBackendOrder(orderId, token) {
  return orderApiRequest(`/api/v1/orders/${encodeURIComponent(orderId)}`, { method: "DELETE", token });
}