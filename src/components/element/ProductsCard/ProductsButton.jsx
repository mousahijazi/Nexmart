export default function ProductsButton({children, onClick, ariaLabel}) {
  return (
    <button 
      onClick={onClick}
      aria-label={ariaLabel}
      className="
        absolute 
        bottom-0 
        right-0
        p-3 
        rounded-tl-3xl
        hover:bg-gray-100 dark:hover:bg-zinc-600
        cursor-pointer
        transition duration-200">
            {children}
    </button>
  )
}
