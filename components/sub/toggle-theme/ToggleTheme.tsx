import { Dispatch, SetStateAction } from "react";
import styles from "./ToggleTheme.module.css";
import useThemeSwitcher from "@/hooks/useThemeSwitcher";

const ToggleTheme = () => {
  const [mode, setMode] = useThemeSwitcher();
  const handleToggleTheme = () => {
    setMode?.(mode === "dark" ? "light" : "dark");
  };

  return (
    <div
      id="toggle-theme"
      className={`${styles.toggleTheme} ${
        mode === "dark" ? styles.night : styles.day
      }`}
      onClick={handleToggleTheme}
    >
      <div className={mode === "dark" ? styles.moon : styles.sun}></div>
    </div>
  );
};

export default ToggleTheme;
