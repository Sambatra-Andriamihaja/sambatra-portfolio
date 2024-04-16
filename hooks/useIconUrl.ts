import useDarkMode from "./useDarkMode";

const useIconUrl = () => {
  const { isDarkMode } = useDarkMode();

  return isDarkMode
    ? "/images/icons/app/S_dark.png"
    : "/images/icons/app/S_light.png";
};

export default useIconUrl;
