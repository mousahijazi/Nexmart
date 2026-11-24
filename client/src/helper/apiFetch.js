const BFF_BASE_URL = "/api/backend";
// const FRONTEND_URL = process.env.FRONTEND_URL;

export async function apiFetch(path, options = {}) {
  if (!path.startsWith("/api/v1/")) {
    throw new Error(`Invalid backend API path: ${path}`);
  }

  const { headers: customHeaders, ...fetchOptions } = options;

  const headers = new Headers(customHeaders || {});

  return fetch(`http://localhost:3000${BFF_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
    cache: "no-store",
    credentials: "same-origin",
  });
}

export async function readApiJson(response) {
  const result = await response.json().catch(() => null);

  if (!response.ok || result?.status === "error") {
    throw new Error(result?.message || result?.data?.message || `Request failed with status ${response.status}`);
  }

  return result;
}

export function getApiError(error, fallback = "Something went wrong") {
  return error?.message || fallback;
}
