"use client" 
import { useProductContext } from "@/Context/CartProvider"; 
import { useTranslations } from "next-intl"; 
 
export default function DashboardData() { 
    const t = useTranslations(); 
    const {cart} = useProductContext(); 
 
    const categoriesCount = new Set( 
        cart.map(product => product.category) 
    ).size; 
 
    let totalPrice = cart.reduce((total, product) => total + product.price, 0); 
 
    const data = [ 
        { 
            title: t("cart.cartDashboard.dashboardData.products"), 
            value: cart.length, 
        }, 
        { 
            title: t("cart.cartDashboard.dashboardData.price"), 
            value: `${totalPrice.toFixed(2)}$`, 
        }, 
        { 
            title: t("cart.cartDashboard.dashboardData.categories"), 
            value: categoriesCount, 
        }, 
        { 
            title: t("cart.cartDashboard.dashboardData.total"), 
            value: `${totalPrice.toFixed(2)}$`, 
        }, 
    ]; 
     
  return ( 
    <div className="grid gap-7 grid-cols-1 sm:grid-cols-2 w-full"> 
        <div className="flex flex-col justify-center gap-6"> 
            {data.map((ele, index) => ( 
                <p key={index} className="text-gray-600 dark:text-gray-300 tracking-wider ">{ele.title} : <span className="text-[var(--color-green-dark)] dark:text-[var(--color-gold)] font-semibold text-sm">{ele.value}</span></p> 
            ))} 
        </div> 
    </div> 
  ) 
}