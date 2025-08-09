"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeDebug() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Loading theme...</div>;
  }

  return (
    <div className="fixed top-4 left-4 bg-background border border-border p-4 rounded-lg shadow-lg z-50">
      <h3 className="font-bold mb-2">Theme Debug</h3>
      <div className="text-sm space-y-1">
        <div>Theme: {theme}</div>
        <div>Resolved: {resolvedTheme}</div>
        <div>Mounted: {mounted ? "Yes" : "No"}</div>
        <div className="mt-2">
          <button
            onClick={() => setTheme("light")}
            className="mr-2 px-2 py-1 bg-blue-500 text-white rounded text-xs">
            Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className="mr-2 px-2 py-1 bg-gray-500 text-white rounded text-xs">
            Dark
          </button>
          <button
            onClick={() => setTheme("system")}
            className="px-2 py-1 bg-green-500 text-white rounded text-xs">
            System
          </button>
        </div>
      </div>
    </div>
  );
}
