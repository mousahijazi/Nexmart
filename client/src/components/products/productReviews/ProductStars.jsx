export default function ProductStars({ rating }) {
  const fullStars = Math.floor(rating);

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5`}>
      {[...Array(5)].map((ele, index) => {
        const starNumber = index + 1;

        return (
          <span
            key={index}
            className={`text-[21px] leading-none transition ${
              starNumber <= fullStars
                ? "text-[var(--color-gold)]"
                : "text-[var(--color-field)]"
            }`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
