import { ProductStars } from "@/index"; 

export default function Rating({rating}) {
    const radius = 40; // The radius of the circle
    const circumference = 2 * Math.PI * radius; // Equation of circumference of a circle
    const percentage = (rating / 5) * 100; //Convert the rating to a value out of 100
    const strokeDashoffset = circumference - (percentage / 100) * circumference; // Calculate the space that the value will occupy from an SVG element.

  return (
    <div className="flex items-center gap-6">
        <div className="relative flex items-center justify-center w-24 h-24">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-white"
                    strokeWidth="6"
                    fill="transparent"
                />

                <circle
                    cx="48"
                    cy="48"
                    r={radius}
                    className="stroke-orange-400"
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                />
            </svg>

            <span className="absolute text-xl font-bold text-gray-800">
                {rating.toFixed(1)}
            </span>
        </div>
        <div className="flex flex-col items-start gap-1">
            <ProductStars rating={rating} />
            <span className="text-[16px] max-[400px]:text-sm text-gray-600 font-semibold">from 1,25K reviews</span>
        </div>
    </div>
  )
}
