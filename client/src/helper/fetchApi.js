const API_URL = process.env.NEXT_PUBLIC_API_URL;

function normalizeListResponse(json, res) {
  if (Array.isArray(json)) {
    const total = Number(res.headers.get("X-Total-Count")) || json.length;
    return { items: json, total };
  }
 
  return { items: json.data || [], total: json.items ?? (json.data?.length || 0) };
}


export async function getProducts(limit = 20, skip = 0) {
  try {
    const page = Math.floor(skip / limit) + 1;
 
    const res = await fetch(`${API_URL}/api/v1/products?page=${page}&limit=${limit}`, {
      cache: "no-store",
    });
 
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
 
    const json = await res.json();
    const { products, totalProducts } = json.data;

    return {products, total: totalProducts};
  } catch (error) {
    console.log(error);
    return { products: [], total: 0 };
  }
}

export async function getProduct(id) {
  try {
    const res = await fetch(`${API_URL}/api/v1/products/${id}`, { cache: "no-store" });
 
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
 
    const json = await res.json();
    const { product } = json.data;

    return {product};
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getCategories(category, limit) {
  try {
    const url = category
      ? `${API_URL}/api/v1/products?categories=${category}${limit ? `&page=1&limit=${limit}` : ""}`
      : `${API_URL}/api/v1/categories`;

    const categoriesFetch = await fetch(url, { cache: "no-store" });
 
    if (!categoriesFetch.ok) {
      throw new Error(`HTTP error! status: ${categoriesFetch.status}`);
    }
    
    const json = await categoriesFetch.json();
    const categories = json.data?.products || json.data?.categories || [];

    return {categories};
  } catch (error) {
    console.log(error);
    return [];
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

// login
import { supabase } from "../lib/supabase";

export async function loginUser(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({email, password});

    if (error) {
        return {success: false, message: error.message};
    }

    return {success: true, user: data.user, session: data.session};
}

// register
export async function registerUser(email, password, firstName, lastName, userImage) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
                image: userImage || "/Profile.jpg",
                role: "user"
            }
        }
    });

    return error 
        ? {success: false, message: error.message} 
        : {success: true, user: data?.user, session: data?.session};
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
