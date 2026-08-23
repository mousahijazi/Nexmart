export default function StepCircle({ stepNumber, label, isActive }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                isActive 
                    ? "bg-[var(--color-green)] text-white" 
                    : "bg-transparent border-2 border-[var(--color-green)]/40 text-[var(--color-green)]/40"
            }`}>
                {stepNumber}
            </div>
            <span className={`text-xs font-semibold ${
                isActive ? "text-[var(--color-green)] dark:text-[var(--color-gold)]" : "text-[var(--color-soft-2)]"
            }`}>
                {label}
            </span>
        </div>
    );
}