export default function StepCircle({ stepNumber, label, isActive }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-300 ${
                isActive 
                    ? "bg-[#5B3A21] text-white" 
                    : "bg-transparent border-2 border-[#5B3A21]/40 text-[#5B3A21]/40"
            }`}>
                {stepNumber}
            </div>
            <span className={`text-xs font-semibold ${
                isActive ? "text-[#5B3A21] dark:text-[#A68A64]" : "text-gray-600"
            }`}>
                {label}
            </span>
        </div>
    );
}