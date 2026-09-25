const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeListResponse(json, res) {
  if (Array.isArray(json)) {
    const total = Number(res.headers.get("X-Total-Count")) || json.length;
    return { items: json, total };
  }
 
  return { items: json.data || [], total: json.items ?? (json.data?.length || 0) };
}


export async function getProducts(limit = 20, skip = 0, token = null) {
  try {
    const page = Math.floor(skip / limit) + 1;
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
 
    const res = await fetch(`${API_URL}/api/v1/products?page=${page}&limit=${limit}`, {
      headers,
      cache: "no-store",
    });
 
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
 
    const json = await res.json();
    const { products, total, totalPages } = json.data;

    return {products, total, totalPages};
  } catch (error) {
    console.log(error);
    return { products: [], total: 0, totalPages: 0 };
  }
}

export async function getProduct(id, token = null) {
  try {
    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const res = await fetch(`${API_URL}/api/v1/products/${id}`, { 
      headers,
      cache: "no-store" 
    });
 
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
 
    const json = await res.json();
    const { product } = json.data;

    return {product};
  } catch (error) {
    console.log(error);
    return { product: {} };
  }
}

export async function updateProduct(productId, formData, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${productId}`,
      {
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
        message: result.message || "Failed to update product",
      };
    }

    const { product } = result.data;
    
    return {
      success: true,
      product: product,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      product: {},
      message: "Something went wrong",
    };
  }
}

export async function getCategoryProducts( categorySlug, limit = 10, page = 1) {
  try {
    const url = `${API_URL}/api/v1/products?categories=${categorySlug}&page=${page}&limit=${limit}`;

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    return {
      products: json.data?.products || [],
      total: json.data?.total || 0,
      page: json.data?.page || page,
      limit: json.data?.limit || limit,
      totalPages: json.data?.totalPages || 0,
    };
  } catch (error) {
    console.error("getCategoryProducts:", error);

    return {
      products: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export async function getCategories(limit = 10, page = 1) {
  try {
    const url = `${API_URL}/api/v1/categories?page=${page}&limit=${limit}`;
    const response = await fetch(url, { cache: "no-store" });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();

    return {
      categories: json.data?.categories || [],
      total: json.data?.total || 0,
      page: json.data?.page || page,
      limit: json.data?.limit || limit,
      totalPages: json.data?.totalPages || 0,
    };
  } catch (error) {
    console.error("getCategories:", error);

    return {
      categories: [],
      total: 0,
      page,
      limit,
      totalPages: 0,
    };
  }
}

export async function getBrand(limit, page = 1) {
    try {
      const res = await fetch(`${API_URL}/api/v1/brands${limit ? `?page=${page}&limit=${limit}` : ""}`, {cache: "no-store"});
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const json = await res.json();
      const brands = json.data?.brands|| [];

      return {brands};
    } catch (error) {
      console.log(error);
      return { brands: [] };
    }
}

// users
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

// admin
export async function createProduct(formData, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await res.json();

    if (!res.ok || result.status !== "success") {
      return {
        success: false,
        message: result.message || "Failed to create product",
      };
    }

    return {
      success: true,
      product: result.data.product,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}


export async function updateProductStatus(productId, isActive, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${productId}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive }),
        cache: "no-store",
      }
    );

    const result = await res.json();

    if (!res.ok || result.status !== "success") {
      return {
        success: false,
        message: result.message ||"Failed to update product status",
      };
    }

    return {
      success: true,
      product: result.data?.product,
      message: result.message,
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function createCategory(formData, token) {
  try {
    const res = await fetch(`${API_URL}/api/v1/categories`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const json = await res.json();

    if (!res.ok || json.status !== "success") {
      return { success: false, message: json.message || "Failed to create category" };
    }

    return { success: true, category: json.data?.category };
  } catch (error) {
    return { success: false, message: "Something went wrong" };
  }
}


export const updateCategory = async (categoryId, formData, token) => {
  try {
    const response = await fetch(`${API_URL}/api/v1/categories/${categoryId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to update category",
      };
    }

    return {
      success: true,
      category: result.data.category,
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong",
    };
  }
};

// auth
import { supabase } from "../lib/supabase";

// login
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

// logout
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

// todo
export function endOfDay(dateInput) {
  const date = new Date(dateInput);
  date.setHours(23, 59, 59, 999);
  return date;
}

// todo
export async function getActiveOffer() {
  try {
    const res = await fetch(`${API_URL}/offers`, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
 
    const json = await res.json();
    const { items: offers } = normalizeListResponse(json, res);
 
    const now = new Date();
 
    const activeOffer = offers.find((offer) => {
      if (!offer.isActive) return false;
 
      const start = new Date(offer.startDate);
      const end = endOfDay(offer.endDate);
 
      return now >= start && now <= end;
    });
 
    return activeOffer || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

// todo
export async function getOfferProducts(offer, limit = 4) {
  if (!offer) return [];
 
  try {
    let url;
 
    if (offer.targetType === "category" && offer.targetId) {
      url = `${API_URL}/products?category=${offer.targetId}&_page=1&_per_page=${limit}`;
    } else {
      url = `${API_URL}/products?_page=1&_per_page=${limit}`;
    }
 
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
 
    const json = await res.json();
    const { items } = normalizeListResponse(json, res);
 
    return items.filter((p) => p.discountPrice != null).slice(0, limit);
  } catch (error) {
    console.log(error);
    return [];
  }
}


// subscribeToNewsletter
export async function subscribeToNewsletter(email) {
  try {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      if (error.code === "23505") {
        return { success: false, message: "هذا البريد الإلكتروني مُشترك بالفعل!" };
      }
      return { success: false, message: error.message };
    }

    return { success: true, order: data };
  } catch (err) {
    return { success: false, message: "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً." };
  }
}

// create order
export async function createOrder({ userId, shippingInfo, needShipping, grandTotal }) {
    const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
            user_id: userId,
            payment_status: "pending",
            total_price: grandTotal,
            shipping_address: needShipping
                ? `${shippingInfo.address}, ${shippingInfo.city}`
                : "No shipping",
            phone: shippingInfo.phone,
            notes: shippingInfo.notes || null,
            full_name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
            city: shippingInfo.city,
            address: shippingInfo.address,
        })
        .select()
        .single();

    if (orderError) {
        return { success: false, message: orderError.message };
    }

    return { success: true, order: orderData };
}

// create order items
export async function createOrderItems(orderId, checkoutItems) {
    const orderItemsPayload = checkoutItems.map((item) => ({
        order_id: orderId,
        product_id: item.id,
        product_title: item.title,
        thumbnail: item.thumbnail || null,
        price: item.price,
        quantity: item.quantity || 1,
        subtotal: item.price * (item.quantity || 1),
    }));

    const { data, error } = await supabase
        .from("order_items")
        .insert(orderItemsPayload);

    if (error) {
        return { success: false, message: error.message };
    }

    return { success: true, items: data };
}

// get user orders
export async function getUserOrders(userId) {
    const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        return { success: false, orders: [] };
    }

    return { success: true, orders: data };
}

// get order by id 
export async function getOrderById(orderId, userId) {
    const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*)")
        .eq("id", orderId)
        .eq("user_id", userId)
        .single();

    if (error || !data) {
        return { success: false };
    }

    return { success: true, order: data };
}

// update order
export async function updateOrderPaymentStatus(orderId, userId, status, paymentId = null) {
    const { data, error } = await supabase
        .from("orders")
        .update({ payment_status: status, payment_id: paymentId })
        .eq("id", orderId)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        return { success: false, message: error.message };
    }

    return { success: true, order: data };
}

// create pay
export async function createMoyasarPayment(paymentData) {
    try {
        const body = new URLSearchParams({
            ...paymentData,
            publishable_api_key: process.env.NEXT_PUBLIC_MOYASAR_PUBLISHABLE_KEY,
        });

        const response = await fetch("https://api.moyasar.com/v1/payments", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: body.toString(),
        });

        const data = await response.json();

        if (!response.ok) {
            return { success: false, message: data.message || "Payment could not be started" };
        }

        return { success: true, payment: data };
    } catch (error) {
        return { success: false, message: "Network error, please try again" };
    }
}
