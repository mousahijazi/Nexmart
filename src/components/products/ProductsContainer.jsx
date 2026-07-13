"use client"
import { ProductsFilter, ProductsCard, Loader } from "../../index";
import { useState, useMemo, Suspense } from "react";
import { getProducts } from "@/helper/fetchApi";

export default function ProductsContainer({data, totalProducts, categories}) {
  const [products, setProducts] = useState(data);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const PRODUCTS_PER_PAGE = 20;

  // This function that I used on the "Show More Products" button, I did not put it as a useEffect function because I do not want it to work with a value that changes, but rather with a button that is pressed!
  const loadMoreProducts = async () => {
    if (products.length >= totalProducts) return;
    
    const nextSkip = products.length; 
    const res = await getProducts(PRODUCTS_PER_PAGE, nextSkip);
    
    setProducts((prev) => [...prev, ...res.products]);
  };

  // This is the function I used on the "Show Less" button; it's the opposite of the "Show More" function. You know why I didn't use UseEffect, Engineer Atef?
  const showLessProducts = () => {
    if (products.length <= PRODUCTS_PER_PAGE) return;

    setProducts(prev =>
      prev.slice(0, prev.length - PRODUCTS_PER_PAGE)
    );
  };

  // Filter categories
  const filteredCategories = useMemo(() => {    
    const visibleCategories = [
      ...new Set(
        products.map(product => product.category)
      )
    ];

    return categories.filter(category =>
      visibleCategories.includes(category.slug)
    );
  }, [products, categories]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  return (
    <>
        <ProductsFilter data={products} search={search} setSearch={setSearch} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={filteredCategories} />
        
        <Suspense fallback={<Loader />}>
          <div className="max-w-7xl mx-auto px-6 py-12">
              <ProductsCard data={filteredProducts} showRating={true} />
              
              <div className="mt-12 flex gap-2 items-center justify-center">
                {products.length > PRODUCTS_PER_PAGE && (
                    <button
                      onClick={showLessProducts}
                      className="bg-gray-300 dark:text-zinc-900 px-8 py-3 rounded-xl cursor-pointer hover:opacity-70 transition duration-300"
                    >
                      Show Less
                    </button>
                )}
                {products.length < totalProducts && (
                    <button 
                      onClick={loadMoreProducts}
                      className="bg-[#5B3A21] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition duration-300 disabled:opacity-50 cursor-pointer"
                    >
                      Show More
                    </button>
                )}
              </div>
          </div>
        </Suspense>
    </>
  )
}
