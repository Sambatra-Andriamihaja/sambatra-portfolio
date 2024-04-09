import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./ToggleTheme.module.css";
// import useThemeSwitcher from "@/hooks/useThemeSwitcher";
import { useTheme } from "next-themes";

const ToggleTheme = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  // const [mode, setMode] = useThemeSwitcher();
  const handleToggleTheme = () => {
    // setMode?.(mode === "dark" ? "light" : "dark");
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <div
      id="toggle-theme"
      className={`${styles.toggleTheme} ${
        resolvedTheme === "dark" ? styles.night : styles.day
      }`}
      onClick={handleToggleTheme}
    >
      <div
        className={resolvedTheme === "dark" ? styles.moon : styles.sun}
      ></div>
    </div>
  );
};

export default ToggleTheme;
