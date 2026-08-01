export async function getProducts(limit = 20, skip = 0) {
    try {
        const productsFetch = await fetch(
            `https://dummyjson.com/products${limit ? `?limit=${limit}` : ""}${skip ? `&skip=${skip}` : ""}`,
            { next: { revalidate: 3600 } }
        );
        const products = await productsFetch.json();
        return {
            products: products.products,
            total: products.total 
        };
    } catch (error) {
        console.log(error);
        return {products: [], total: 0};
    }
}

export async function getCategories(category = "", limit) {
    try {
        const categoriesFetch = await fetch(
            category
                ? `https://dummyjson.com/products/category/${category}${limit ? `?limit=${limit}` : ""}`
                : `https://dummyjson.com/products/categories`,
                { next: { revalidate: 3600 } }
        );
        const categories = await categoriesFetch.json();
        return categories;
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function getProduct(id) {
    try {
        const res = await fetch(
            `https://dummyjson.com/products/${id}`,
            { next: { revalidate: 3600 } }
        );

        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

// login
import { supabase } from "@/lib/supabase";

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
