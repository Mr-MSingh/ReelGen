"use client";

import { useLanguage } from "./language-provider";
import { LANGUAGE_OPTIONS } from "./site-language";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-[var(--landing-outline)] bg-[var(--landing-panel-bg)] p-1 backdrop-blur-sm"
      aria-label="Language switcher"
      role="group"
    >
      {LANGUAGE_OPTIONS.map((option) => {
        const isActive = option.code === language;

        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLanguage(option.code)}
            aria-pressed={isActive}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition sm:px-4 ${
              isActive
                ? "bg-[var(--landing-heading)] text-[var(--landing-bg)] shadow-[0_10px_24px_rgba(38,22,20,0.16)]"
                : "text-[var(--landing-muted)] hover:bg-[var(--landing-panel-bg-strong)] hover:text-[var(--landing-heading)]"
            }`}
          >
            <span className="sm:hidden">
              {option.code === "en" ? "EN" : "हि"}
            </span>
            <span className="hidden sm:inline">{option.nativeLabel}</span>
          </button>
        );
      })}
    </div>
  );
}
