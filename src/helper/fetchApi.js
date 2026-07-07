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

export async function getCategories(category = "", limit = 4) {
    try {
        const categoriesFetch = await fetch(
            category
                ? `https://dummyjson.com/products/category/${category}?limit=${limit}`
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

export async function loginUser(username, password) {
    try {
        const userFetch = await fetch(
            "https://dummyjson.com/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            }
        );

        const user = await userFetch.json();
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}
