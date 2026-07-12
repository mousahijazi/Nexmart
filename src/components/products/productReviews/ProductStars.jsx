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
                        ? "text-orange-400" 
                        : "text-gray-300 dark:text-[#F5EBE6]"
                    }`}
                    >
                        ★
                </span>
            );
        })}
    </div>
  )
}
