import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const useDarkMode = () => {
  const { resolvedTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setIsDarkMode(resolvedTheme === "dark");
  }, [resolvedTheme]);

  return isDarkMode;
};

export default useDarkMode;
