import React from "react";

function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="
        relative w-14 h-7 rounded-full 
        transition-colors duration-200
        bg-zinc-300 dark:bg-zinc-600
        hover:bg-zinc-400 dark:hover:bg-zinc-500
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-zinc-900
      "
      aria-label="Toggle theme"
    >
      {/* Toggle circle */}
      <div
        className={`
          absolute top-0.5 left-0.5 w-6 h-6 rounded-full
          bg-white dark:bg-zinc-900
          shadow-md
          transition-transform duration-200 ease-out
          flex items-center justify-center
          ${darkMode ? 'translate-x-7' : 'translate-x-0'}
        `}
      >
        {/* Sun icon - Light mode */}
        {!darkMode && (
          <svg
            className="w-3.5 h-3.5 text-yellow-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        )}

        {/* Moon icon - Dark mode */}
        {darkMode && (
          <svg
            className="w-3.5 h-3.5 text-blue-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </div>
    </button>
  );
}

export default ThemeToggle;