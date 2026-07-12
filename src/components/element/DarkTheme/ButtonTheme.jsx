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
        bg-[#5B3A21]
        text-white
        cursor-pointer
      "
    >
      {darkMode ? <Sun /> : <Moon />}
    </button>
  );
}