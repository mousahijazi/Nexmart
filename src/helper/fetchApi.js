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
