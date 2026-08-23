"use client" 
import { useProductContext } from "@/Context/CartProvider"; 
import { useTranslations } from "next-intl"; 
 
export default function CartDashboardData() { 
    const t = useTranslations(); 
    const {cart, totalPrice} = useProductContext(); 
 
    const categoriesCount = new Set( 
        cart.map(product => product.category)
    ).size; 
  
    const data = [ 
        { 
            title: t("cart.cartDashboard.dashboardData.products"), 
            value: cart.length, 
        }, 
        { 
            title: t("cart.cartDashboard.dashboardData.price"), 
            value: `${totalPrice.toFixed(2)}`, 
        }, 
        { 
            title: t("cart.cartDashboard.dashboardData.categories"), 
            value: categoriesCount, 
        }, 
        { 
            title: t("cart.cartDashboard.dashboardData.total"), 
            value: `${totalPrice.toFixed(2)}`, 
        }, 
    ]; 
     
  return ( 
    <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 w-full"> 
        {data.map((ele, index) => ( 
            <div key={index} className="flex gap-2 items-center text-sm py-2 text-[var(--color-soft)]">
                <span>{ele.title}</span>
                <span>{ele.value}</span>
            </div> 
        ))} 
    </div> 
  ) 
}
