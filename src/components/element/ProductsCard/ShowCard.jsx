"use client"
import { ProductsButton } from "@/index";
import { Trash2, ShoppingCart } from "lucide-react";
import { useProductContext } from "@/Context/CartProvider";

export default function ShowCard({showCard, product}) {
    const {removeFromCart, addToStorage} = useProductContext();
    
    const handleAdd = () => {
        addToStorage(product);
    };

    const handleRemove = () => {
        removeFromCart(product);
    };

  return (
    <>
        {showCard 
            ? <ProductsButton onClick={handleAdd} ariaLabel={`Add ${product.title} to cart`}>
                <ShoppingCart size={20} strokeWidth={2.5} className="dark:text-[#f1f1f1]" />
              </ProductsButton>
            : <ProductsButton onClick={handleRemove} ariaLabel={`remove ${product.title} from cart`}>
                <Trash2 size={20} strokeWidth={2.5} className="dark:text-[#f1f1f1]" />
              </ProductsButton>
        }
    </>
  )
}
