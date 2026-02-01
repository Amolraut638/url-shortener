import React, { useEffect, useState } from "react";

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setDark(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="relative w-16 h-8 rounded-full transition-all duration-300 
                 hover:shadow-lg active:scale-95 overflow-hidden
                 bg-zinc-200 dark:bg-zinc-700"
      aria-label="Toggle dark mode"
      style={{
        background: dark 
          ? 'linear-gradient(to right, #1e293b, #334155)' 
          : 'linear-gradient(to right, #cbd5e1, #e2e8f0)'
      }}
    >
      {/* Stars for dark mode */}
      {dark && (
        <>
          <div className="absolute top-2 left-2 w-0.5 h-0.5 bg-white rounded-full opacity-80"></div>
          <div className="absolute top-3 left-5 w-0.5 h-0.5 bg-white rounded-full opacity-60"></div>
          <div className="absolute top-4 left-3 w-0.5 h-0.5 bg-white rounded-full opacity-70"></div>
        </>
      )}

      {/* Toggle circle with icon */}
      <div
        className={`
          absolute top-1 left-1 w-6 h-6 rounded-full
          bg-white dark:bg-zinc-900
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          shadow-md
          ${dark ? 'translate-x-8' : 'translate-x-0'}
        `}
      >
        {/* Sun icon */}
        <svg
          className={`
            absolute w-4 h-4 text-yellow-500
            transition-all duration-300
            ${dark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}
          `}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>

        {/* Moon icon */}
        <svg
          className={`
            absolute w-4 h-4 text-yellow-300
            transition-all duration-300
            ${dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'}
          `}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  );
}

export default DarkModeToggle;