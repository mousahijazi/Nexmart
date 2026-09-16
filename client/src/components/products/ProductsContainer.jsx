"use client" 
import { ProductsFilter, ProductsCard } from "../../index"; 
import { useState, useEffect, useMemo, useRef } from "react"; 
import { getProducts, getCategories } from "../../helper/fetchApi"; 
import { useSearchParams } from "next/navigation"; 
import { useRouter } from "../../lib/i18n/routing"; 
import { ArrowDown, ArrowUp } from "lucide-react"; 
import { useTranslations, useLocale } from "next-intl"; 
 
export default function ProductsContainer({data, totalProducts}) { 
  const t = useTranslations(); 
  const locale = useLocale();
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
  const PRODUCTS_PER_PAGE = 20; 
 
  useEffect(() => { 
    async function handleCategoryChange() { 
      if (categoryFromUrl) { 
        setIsLoadingCategory(true); 
 
        const {categories} = await getCategories(categoryFromUrl); 
        const productsList = Array.isArray(categories)
          ? categories
          : [];

        setProducts(productsList);
        setIsLoadingCategory(false);
      } else { 
        setProducts(data); 
      } 
    } 
 
    handleCategoryChange(); 
  }, [categoryFromUrl, data]); 
 
  const resetToAllProducts = () => { 
    router.push("/products#products");  
  }; 
 
  const loadMoreProducts = async () => { 
    if (products.length >= totalProducts) return; 
     
    const nextSkip = products.length;  
    const res = await getProducts(PRODUCTS_PER_PAGE, nextSkip); 
     
    setProducts((prev) => [...prev, ...res.products]); 
  }; 
 
  const showLessProducts = () => { 
    if (products.length <= PRODUCTS_PER_PAGE) return; 
 
    setProducts(prev => 
      prev.slice(0, prev.length - PRODUCTS_PER_PAGE) 
    ); 
  }; 
 
  // Filter products 
  const filteredProducts = useMemo(() => { 
    return products.filter((product) => { 
      const matchesSearch = product?.title?.[locale].toLowerCase().includes(search.toLowerCase()); 
 
      return matchesSearch; 
    }); 
  }, [products, search]); 
 
  return ( 
    <> 
      <ProductsFilter search={search} setSearch={setSearch} /> 
      <div ref={productsRef} className="max-w-7xl mx-auto px-6 pt-12 pb-7"> 
          <ProductsCard data={filteredProducts} showRating={true} /> 
          <div className="mt-12 flex gap-2 items-center justify-center"> 
            {categoryFromUrl ? ( 
                <button 
                  onClick={resetToAllProducts} 
                  ref={buttonRef} 
                  className="bg-[var(--color-green-dark)] dark:bg-[#0f2e25] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 dark:hover:bg-[#153e32] border border-transparent dark:border-[#22332e] transition duration-300 disabled:opacity-50 cursor-pointer shadow-md" 
                > 
                  {t("shop.products.filter.button.showAllProducts")} 
                </button> 
              ) : ( 
                <div ref={buttonRef} className="max-[400px]:w-full flex max-[400px]:flex-col gap-3"> 
                  {products.length > PRODUCTS_PER_PAGE && ( 
                    <button 
                      onClick={showLessProducts} 
                      className="bg-gray-200 text-gray-800 dark:bg-[#202d29] dark:text-gray-200 border border-transparent dark:border-[#2b3d37] px-8 py-3 rounded-xl cursor-pointer hover:bg-gray-300 dark:hover:bg-[#283833] transition duration-300 font-medium" 
                    > 
                      {t("shop.products.filter.button.showLess")} 
                    </button> 
                  )} 
                  {products.length < totalProducts && ( 
                    <button  
                      onClick={loadMoreProducts} 
                      className="bg-[var(--color-green-dark)] dark:bg-[#0f2e25] text-white font-bold px-8 py-3 rounded-xl hover:opacity-90 dark:hover:bg-[#153e32] border border-transparent dark:border-[#22332e] transition duration-300 disabled:opacity-50 cursor-pointer shadow-md" 
                    > 
                      {t("shop.products.filter.button.showMore")} 
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
                end-8 
                w-14 
                h-14 
                cursor-pointer 
                rounded-full 
                bg-[var(--color-green-dark)] 
                dark:bg-[#18221f] 
                text-white 
                dark:text-[var(--color-gold)] 
                border 
                border-transparent 
                dark:border-[#22332e] 
                shadow-xl 
                hover:scale-110 
                transition duration-300 
                z-50 
            " 
          > 
            {isBottom ? <ArrowUp /> : <ArrowDown />} 
          </button> 
      </div> 
    </> 
  ) 
}