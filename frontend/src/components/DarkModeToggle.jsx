import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  // Initialise from saved pref / system pref
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved === "dark" || (!saved && sysDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Light mode" : "Dark mode"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--text-2)",
        backgroundColor: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 7,
        cursor: "pointer",
        transition: "border-color 0.15s ease, background-color 0.15s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--text-3)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
    >
      {dark
        ? <Sun size={14} strokeWidth={2} />
        : <Moon size={14} strokeWidth={2} />
      }
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}

export default DarkModeToggle;