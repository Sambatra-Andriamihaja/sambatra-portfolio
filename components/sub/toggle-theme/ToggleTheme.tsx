import React from "react";
import styles from "./ToggleTheme.module.css";

interface IToggleTheme {
  mode: string;
  setMode: React.Dispatch<string>;
}

const ToggleTheme = (props: IToggleTheme) => {
  const { mode, setMode } = props;
  const handleToggleTheme = () => {
    setMode(mode === "dark" ? "light" : "dark");
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
