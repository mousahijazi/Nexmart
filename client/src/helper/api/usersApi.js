import { apiFetch, readApiJson, getApiError } from "../apiFetch";

export async function getAllUsers() {
  try {
    const response = await apiFetch("/api/v1/users");

    const result = await readApiJson(response);

    return {
      status: "success",
      users: result.data?.users || [],
    };
  } catch (error) {
    console.error("Failed to fetch users:", error);

    return {
      status: "error",
      users: [],
      message: getApiError(error),
    };
  }
}

export async function getCurrentUser() {
  try {
    const response = await apiFetch("/api/v1/users/me");

    const result = await readApiJson(response);
    const user = result.data?.user;

    if (!user) {
      return {
        success: false,
        message: "User information was not returned",
      };
    }

    return {
      success: true,
      user,
      role: user.role,
      redirectTo: result.data?.redirectTo || null,
    };
  } catch (error) {
    return {
      success: false,
      message: getApiError(error, "Failed to get current user"),
    };
  }
}

export async function updateUser(formData) {
  try {
    const response = await apiFetch("/api/v1/users/me", {
      method: "PATCH",
      body: formData,
    });

    const result = await readApiJson(response);

    return {
      success: true,
      user: result.data?.user || null,
    };
  } catch (error) {
    console.error("updateUser:", error);

    return {
      success: false,
      message: getApiError(error, "Failed to update profile"),
    };
  }
}