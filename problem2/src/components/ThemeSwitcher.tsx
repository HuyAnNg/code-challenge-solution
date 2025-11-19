import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeSwitcher = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-white/80 dark:bg-zinc-800/80 shadow hover:bg-blue-100 dark:hover:bg-purple-900 transition-all"
      onClick={() => setDark((d) => !d)}
      aria-label="Toggle theme"
    >
      {dark ? (
        <Sun className="w-6 h-6 text-yellow-400" />
      ) : (
        <Moon className="w-6 h-6 text-purple-400" />
      )}
    </button>
  );
};
