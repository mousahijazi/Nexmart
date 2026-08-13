"use client";
import {Moon, Sun} from "lucide-react";
import {useThemeContext} from "@/Context/ThemeProvider";

export default function ThemeButton() {
  const {darkMode, toggleTheme} = useThemeContext();

  return (
    <button
      onClick={toggleTheme}
      className="
        p-2
        rounded-full
        text-[#E8EDE9] dark:text-[var(--color-gold)]
        hover:text-[var(--color-gold-light)] transation duration-300
        cursor-pointer
      "
      aria-label="Theme mood"
    >
      {darkMode ? <Sun /> : <Moon />}
    </button>
  );
}