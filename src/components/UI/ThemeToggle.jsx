import  useDarkMode  from "../../context/DarkModeContext";
function ThemeToggle(){
  const { darkMode, setDarkMode } = useDarkMode();
  return (
    <button 
        onClick={()=>setDarkMode(!darkMode)} 
        className="px-3 py-1 rounded bg-white/80 dark:bg-gray-700">
        {darkMode ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}

export default ThemeToggle;