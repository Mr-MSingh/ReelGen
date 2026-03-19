"use client";

import { useLanguage } from "./language-provider";
import { useTheme } from "./theme-provider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const labels =
    language === "hi"
      ? { dark: "डार्क मोड", light: "लाइट मोड" }
      : { dark: "Dark Mode", light: "Light Mode" };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="whitespace-nowrap rounded-full border border-[var(--landing-outline)] bg-[var(--landing-panel-bg)] px-3 py-2 text-xs font-medium text-[var(--landing-fg)] backdrop-blur-sm transition hover:border-[var(--landing-outline-strong)] sm:px-4 sm:text-sm"
    >
      {theme === "light" ? labels.dark : labels.light}
    </button>
  );
}
