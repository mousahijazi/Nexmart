export default function OrderDashboardButton({onClick, icon, label, disabled}) {
  return (
    <button
        onClick={onClick}
        disabled={disabled}
        className="p-2 rounded-full disabled:opacity-30 cursor-pointer"
        aria-label={label}
    >
        {icon}
    </button>
  )
}
