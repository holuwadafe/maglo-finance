"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";

export function ThemeToggle({ className }: { className?: string }) {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      title={isDark ? "Switch to light" : "Switch to dark"}
      className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition ${className || ""}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-600" />
      )}
    </button>
  );
}
