export default function CategoriesButton({ action, icon, ariaLabel }) {
  return (
    <button
      onClick={action}
      aria-label={ariaLabel}
      className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-ink)] transition-all duration-300 hover:bg-[var(--color-green)] hover:text-white hover:border-[var(--color-green)] dark:hover:bg-[var(--color-gold)] dark:hover:text-[var(--color-green-deep)] dark:hover:border-[var(--color-gold)] shadow-sm hover:shadow-md"
    >
      {icon}
    </button>
  );
}