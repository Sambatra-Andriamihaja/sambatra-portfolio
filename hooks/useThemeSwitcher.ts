import { Dispatch, SetStateAction, useEffect, useState } from "react";

const useThemeSwitcher = (): [string, Dispatch<SetStateAction<string>>] => {
  const preferDarkQuery = "(prefers-color-scheme: dark)";
  const [mode, setMode] = useState<string>("");

  useEffect(() => {
    const mediaQuery = window.matchMedia(preferDarkQuery);
    const userPref = window.localStorage.getItem("theme");

    const handleChange = () => {
      let theme;

      if (userPref) {
        // Use user's preference if available in local storage
        theme = userPref === "dark" ? "dark" : "light";
      } else {
        // Otherwise, use system preference
        theme = mediaQuery.matches ? "dark" : "light";
      }

      // Update CSS class based on theme
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      setMode(theme);
    };

    handleChange();

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    // Store theme preference in local storage
    if (mode !== "") {
      window.localStorage.setItem("theme", mode);
      if (mode === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [mode]);

  return [mode, setMode];
};

export default useThemeSwitcher;
