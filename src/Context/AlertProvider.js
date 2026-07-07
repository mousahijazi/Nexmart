"use client";
import { X } from "lucide-react";
import { createContext, useContext, useState, useRef } from "react";

const AlertContext = createContext();

export default function AlertProvider({ children }) {
    const [alert, setAlert] = useState(null);
    // todo 
    const timeoutRef = useRef(null);

    const showAlert = (message, type = "success") => {
        if(timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setAlert({ message, type });

        timeoutRef.current = setTimeout(() => {
            setAlert(null);
        }, 3000);
    };
    
    // todo 
    const closeAlert = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        setAlert(null);
    };

    return (
        <AlertContext.Provider value={{ showAlert }}>
            {children}

            {alert && (
                <div
                    className={`
                        fixed bottom-5 right-5
                        px-5 py-3 rounded-xl
                        text-white shadow-lg
                        flex gap-4
                        z-[9999]
                        transition-all
                        ${
                            alert.type === "success"
                                ? "bg-green-400"
                                : "bg-red-400"
                        }
                    `}
                >
                    <span>{alert.message}</span>

                    <button className="cursor-pointer" onClick={closeAlert}>
                        <X size={24} strokeWidth={2} className="text-gray-600" />
                    </button>
                </div>
            )}
        </AlertContext.Provider>
    );
}

export function useAlertContext() {
    return useContext(AlertContext);
}