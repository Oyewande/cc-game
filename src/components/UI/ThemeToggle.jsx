import { useDarkMode } from "../../context/useDarkMode.js";

export default function ThemeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      onClick={toggleDarkMode}
      className="
        relative flex items-center justify-center
        w-12 h-12 rounded-full cursor-pointer
        bg-white/80 dark:bg-gray-700
        shadow-md dark:shadow-gray-500
        transition-all duration-300
        hover:scale-110 active:scale-95
        overflow-hidden
      "
    >
      <span
        className={`
          absolute text-xl transition-all duration-500
          ${isDarkMode 
            ? "opacity-0 rotate-180 scale-50" 
            : "opacity-100 rotate-0 scale-100"}
        `}
      >
        🌙
      </span>

      {/* Light icon (sun) */}
      <span
        className={`
          absolute text-xl transition-all duration-500
          ${isDarkMode 
            ? "opacity-100 rotate-0 scale-100" 
            : "opacity-0 rotate-180 scale-50"}
        `}
      >
        ☀️
      </span>
    </button>
  );
}