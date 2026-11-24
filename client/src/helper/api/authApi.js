import { apiFetch, readApiJson, getApiError } from "../apiFetch";

export async function loginUser(email, password) {
  try {
    const response = await apiFetch("/api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await readApiJson(response);

    return {
      success: true,
      user: result.data?.user || null,
      redirectTo: result.data?.redirectTo || null,
    };
  } catch (error) {
    return {
      success: false,
      message: getApiError(error, "Login failed"),
    };
  }
}

export async function registerUser(email, password, firstName, lastName, phoneNumber = "") {
  try {
    const response = await apiFetch("/api/v1/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        password,
        phoneNumber: phoneNumber || "",
      }),
    });

    const result = await readApiJson(response);

    return {
      success: true,
      user: result.data?.user || null,
      redirectTo: result.data?.redirectTo || null,
    };
  } catch (error) {
    return {
      success: false,
      message: getApiError(error, "Registration failed"),
    };
  }
}

export async function logoutApi() {
  try {
    const response = await apiFetch("/api/v1/users/logout", {
      method: "POST",
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: result?.message || "Failed to logout from server",
      };
    }

    return {
      success: true,
      data: result?.data,
    };
  } catch (error) {
    return {
      success: false,
      message: getApiError(error, "Failed to logout"),
    };
  }
}