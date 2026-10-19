"use client" 
import { useProductContext } from "../../Context/CartProvider"; 
import { useTranslations } from "next-intl"; 
 
export default function CartDashboardData() { 
    const t = useTranslations(); 
    const { cart, totalPrice, grandTotal, taxes } = useProductContext(); 
 
    const categoriesCount = new Set(cart.map(product => product.category)).size; 
    const totalItems = cart.reduce((total, product) => total + (product.quantity || 1), 0);
  
    const data = [ 
        { 
            title: t("cart.cartDashboard.dashboardData.products"), 
            value: totalItems, 
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
            title: "Taxes", 
            value: `${taxes.toFixed(2)}`, 
        }, 
        { 
            title: t("cart.cartDashboard.dashboardData.total"), 
            value: `${grandTotal.toFixed(2)}`, 
        }, 
    ]; 
     
  return ( 
    <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 w-full"> 
        {data.map((ele, index) => ( 
            <div key={index} className="flex gap-2 items-center text-sm py-2 text-[var(--color-soft)]">
                <span>{ele.title}</span>
                <span>{ele.value}</span>
            </div> 
        ))} 
    </div> 
  ) 
}
