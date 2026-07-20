export default function CategoriesButton({action, icon, ariaLabel}) {
  return (
    <button
        onClick={action}
        aria-label={ariaLabel}
        className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#5B3A21]/30 text-[#5B3A21] transition-all duration-300 hover:bg-[#5B3A21] hover:text-white dark:border-[#A68A64]/40 dark:text-[#A68A64] dark:hover:bg-[#A68A64] dark:hover:text-zinc-950"
    >
        {icon}
    </button>
  )
}
