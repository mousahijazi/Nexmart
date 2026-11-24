import { apiFetch, readApiJson, getApiError } from "../apiFetch";

async function orderApiRequest(path, { method = "GET", body, signal } = {}) {
  const response = await apiFetch(path, {
    method,
    ...(body !== undefined
      ? {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      : {}),
    signal,
  });

  return readApiJson(response).then(
    (payload) => payload?.data ?? payload
  );
}

export const getAdminOrders = ({ page = 1, limit = 10, search = "", orderStatus = "", paymentStatus = "", shippingDecision = "" } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search.trim()) params.set("search", search.trim());
  if (orderStatus) params.set("orderStatus", orderStatus);
  if (paymentStatus) params.set("paymentStatus", paymentStatus);
  if (shippingDecision) {
    params.set("shippingDecision", shippingDecision);
  }

  return orderApiRequest(`/api/v1/admin/orders?${params.toString()}`);
};

export async function getBackendAdminOrderItems(orderId, { page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return orderApiRequest(`/api/v1/admin/orders/${encodeURIComponent(orderId)}/items?${params}`);
}

export async function rejectBackendOrder(orderId, reason) {
  return orderApiRequest(
    `/api/v1/admin/orders/${encodeURIComponent(orderId)}/reject`,
    {
      method: "PATCH",
      body: { reason },
    }
  );
}

export async function shipBackendOrder(orderId, reason) {
  return orderApiRequest(
    `/api/v1/admin/orders/${encodeURIComponent(orderId)}/ship`,
    {
      method: "POST",
      body: { reason },
    }
  );
}

export async function createBackendOrder({ shippingInfo, items, coupon }) {
  return orderApiRequest("/api/v1/orders", {
    method: "POST",
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

export async function getBackendMyOrders({ page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return orderApiRequest(`/api/v1/orders/my?${params.toString()}`);
}

export async function getBackendOrderById(orderId, { page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return orderApiRequest(`/api/v1/orders/${encodeURIComponent(orderId)}?${params}`);
}

export async function getBackendOrderItems(orderId, { page = 1, limit = 10 } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return orderApiRequest(`/api/v1/orders/${encodeURIComponent(orderId)}/items?${params}`);
}

export async function updateBackendOrder(orderId, shippingInfo) {
  return orderApiRequest(
    `/api/v1/orders/${encodeURIComponent(orderId)}`,
    {
      method: "PATCH",
      body: { shippingInfo },
    }
  );
}

export async function replaceBackendOrderItems(orderId, items, coupon) {
  return orderApiRequest(
    `/api/v1/orders/${encodeURIComponent(orderId)}/items`,
    {
      method: "PATCH",
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

export async function deliverBackendOrder(orderId) {
  return orderApiRequest(
    `/api/v1/admin/orders/${encodeURIComponent(orderId)}/deliver`,
    { method: "PATCH" }
  );
}

export async function cancelBackendOrder(orderId) {
  return orderApiRequest(
    `/api/v1/orders/${encodeURIComponent(orderId)}`,
    { method: "DELETE" }
  );
}