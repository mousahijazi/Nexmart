const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAllUsers(token) {
  try {
    const response = await fetch(`${API_URL}/api/v1/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const json = await response.json();
    const { users } = json.data;
    return {status: "success", users};
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return { status: "error", users: [] };
  }
}

export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to get current user",
      };
    }

    return {
      success: true,
      user: result.data.user,
      role: result.data.user.role,
      redirectTo: result.data.redirectTo,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

export async function updateUser(formData, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        cache: "no-store",
      }
    );

    const result = await res.json();

    if (!res.ok || result.status !== "success") {
      return {
        success: false,
        message: result.message || "Failed to update profile",
      };
    }

    return {
      success: true,
      user: result.data?.user,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}