"use client"
import { ProductsFilter, ProductsCard } from "@/index";
import { useState, useEffect, useMemo, useRef } from "react";
import { getProducts, getCategories } from "@/helper/fetchApi";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function ProductsContainer({data, totalProducts, categories}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const [isLoadingCategory, setIsLoadingCategory] = useState(false);

  const productsRef = useRef(null);
  const buttonRef = useRef(null);
  const [isBottom, setIsBottom] = useState(false);
  const scrollTo = (ref, block = "center") => {
    ref.current?.scrollIntoView({
        behavior: "smooth",
        block,
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            setIsBottom(entry.isIntersecting);
        },
        {
            threshold: 0.5,
        }
    );

    if (buttonRef.current) {
        observer.observe(buttonRef.current);
    }

    return () => observer.disconnect();
  }, []);
  
  const [products, setProducts] = useState(data);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const PRODUCTS_PER_PAGE = 20;

  useEffect(() => {
    async function handleCategoryChange() {
      if (categoryFromUrl) {
        setIsLoadingCategory(true);
        setSelectedCategory(categoryFromUrl);

        const categoryProducts = await getCategories(categoryFromUrl);
        setProducts(categoryProducts.products);
        setIsLoadingCategory(false);
      } else {
        setSelectedCategory("all");
        setProducts(data);
      }
    }

    handleCategoryChange();
  }, [categoryFromUrl, data]);

  const resetToAllProducts = () => {
    router.push("/products"); 
  };

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
    if (categoryFromUrl) {
      return categories.filter(category => category.slug === categoryFromUrl);
    }

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
      <ProductsFilter data={products} search={search} setSearch={setSearch} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={filteredCategories} categoryFromUrl={categoryFromUrl} resetToAllProducts={resetToAllProducts} />
      <div ref={productsRef} className="max-w-7xl mx-auto px-6 pt-12 pb-7">
          <ProductsCard data={filteredProducts} showRating={true} />
          <div className="mt-12 flex gap-2 items-center justify-center">
            {categoryFromUrl ? (
                <button
                  onClick={resetToAllProducts}
                  ref={buttonRef}
                  className="bg-[#5B3A21] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 transition duration-300 disabled:opacity-50 cursor-pointer"
                >
                  Show All Products
                </button>
              ) : (
                <div ref={buttonRef} className="max-[400px]:w-full flex max-[400px]:flex-col gap-3">
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
              )}
          </div>
          <button
            onClick={() =>
                isBottom
                    ? scrollTo(productsRef, "start")
                    : scrollTo(buttonRef, "center")
            }
            aria-label={`go to ${isBottom ? "up" : "down"}`}
            className="
                flex items-center justify-center
                fixed
                bottom-8
                right-8
                w-14
                h-14
                cursor-pointer
                rounded-full
                bg-[#5B3A21]
                text-white
                shadow-xl
                hover:scale-110
                transition
                z-50
            "
        >
          {isBottom ? <ArrowUp /> : <ArrowDown />}
        </button>
      </div>
    </>
  )
}
