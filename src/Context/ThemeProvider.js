"use client";
import {createContext, useContext, useEffect, useState} from "react";

const ThemeContext = createContext();

export default function ThemeProvider({children}) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(prev => {
      const theme = !prev;

      if (theme) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }

      return theme;
    });
  };

  return (
    <ThemeContext.Provider value={{darkMode, toggleTheme,}}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  return useContext(ThemeContext);
}