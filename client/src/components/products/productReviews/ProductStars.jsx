export default function ProductStars({rating}) { 
    const fullStars = Math.floor(rating); 
 
  return ( 
    <div> 
        {[...Array(5)].map((ele, index) => { 
            const starNumber = index + 1; 
 
            return ( 
                <span 
                    key={index} 
                    className={`text-2xl ${ 
                    starNumber <= fullStars  
                        ? "text-[var(--color-gold)]"  
                        : "text-gray-300 dark:text-[#2b3d37]" 
                    }`} 
                    > 
                        ★ 
                </span> 
            ); 
        })} 
    </div> 
  ) 
}