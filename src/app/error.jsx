"use client";
import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react"; 

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Application Error Logged:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-xl w-full bg-white shadow-2xl rounded-[2.5rem] p-12 border border-red-50 flex flex-col items-center relative overflow-hidden">

        <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-100 rounded-full opacity-60 z-0"></div>
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-red-50 rounded-full opacity-40 z-0"></div>

        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-8 relative z-10 animate-bounce">
            <AlertTriangle size={50} className="text-red-600 stroke-[1.5]" />
        </div>
        
        <h2 className="text-3xl font-bold text-[#5B3A21] mb-3 relative z-10">somthing was wrong</h2>
        
        {/* نص الوصف */}
        <p className="text-gray-600 mb-10 text-sm sm:text-base max-w-sm relative z-10">Please try again</p>

        <button
          onClick={() => reset()} 
          className="relative z-10 flex items-center gap-3 px-8 py-3 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer hover:-translate-y-0.5"
        >
          <RefreshCcw size={20} className="stroke-[2.5]" />
          try again
        </button>
      </div>
    </div>
  );
}