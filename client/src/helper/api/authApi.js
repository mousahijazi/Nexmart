const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function loginUser(email, password) {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || result.status !== "success") {
      return { success: false, message: result.message || "Login failed" };
    }

    return { 
      success: true, 
      token: result.data?.user?.token, 
      user: result.data?.user,
      redirectTo: result.data?.redirectTo,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function registerUser(email, password, firstName, lastName, phoneNumber) {
  try {
    const res = await fetch(`${API_URL}/api/v1/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        firstName, 
        lastName, 
        email, 
        password, 
        phoneNumber: phoneNumber || "", 
      }),
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || result.status !== "success") {
      return { success: false, message: result.message || "Registration failed" };
    }

    return { 
      success: true, 
      token: result.data?.user?.token, 
      user: result.data?.user,
      redirectTo: result.data?.redirectTo,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong" };
  }
}

export const logoutApi = async (token) => {
  const response = await fetch("http://localhost:5000/api/users/logout", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Failed to logout from server");
  }

  return await response.json();
};
