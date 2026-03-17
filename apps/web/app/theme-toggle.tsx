"use client";

import { useTheme } from "./theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full border border-[var(--landing-outline)] bg-[var(--landing-panel-bg)] px-4 py-2 text-sm font-medium text-[var(--landing-fg)] backdrop-blur-sm transition hover:border-[var(--landing-outline-strong)]"
    >
      {theme === "light" ? "Dark Mode" : "Light Mode"}
    </button>
  );
}
