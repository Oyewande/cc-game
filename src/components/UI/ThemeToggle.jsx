import { useDarkMode } from "../../context/useDarkMode.js";

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="relative flex items-center justify-center
        w-9 h-9 rounded-xl cursor-pointer
        bg-slate-100 dark:bg-slate-800
        border border-slate-200 dark:border-slate-700
        shadow-sm hover:shadow-md
        transition-all duration-300
        hover:scale-105 active:scale-95
        overflow-hidden"
    >
      <span
        className={`absolute text-base transition-all duration-500
          ${isDarkMode
            ? "opacity-0 rotate-180 scale-50"
            : "opacity-100 rotate-0 scale-100"}`}
      >
        🌙
      </span>
      <span
        className={`absolute text-base transition-all duration-500
          ${isDarkMode
            ? "opacity-100 rotate-0 scale-100"
            : "opacity-0 rotate-180 scale-50"}`}
      >
        ☀️
      </span>
    </button>
  );
}
