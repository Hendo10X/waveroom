"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function TextThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState("system");

  useEffect(() => {
    setMounted(true);
    setCurrentTheme(theme || "system");
  }, [theme]);

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  if (!mounted) {
    return (
      <button className="block w-full px-4 py-3 text-sm font-dm-mono tracking-tightest uppercase text-foreground hover:bg-muted transition-colors text-left">
        Theme: system
      </button>
    );
  }

  return (
    <button
      onClick={cycleTheme}
      className="block w-full px-4 py-3 text-sm font-dm-mono tracking-tightest uppercase text-foreground hover:bg-muted transition-colors text-left">
      Theme: {currentTheme}
    </button>
  );
}
