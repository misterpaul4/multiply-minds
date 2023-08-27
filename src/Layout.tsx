import { ConfigProvider, FloatButton, theme } from "antd";
import { ReactNode, useEffect, useState } from "react";
import { DarkModeIcon, LightModeIcon } from "./app/icons/Display";

interface IProps {
  children: ReactNode;
}

const Layout = ({ children }: IProps) => {
  const [isDarkMode, setIsDarkMode] = useState(
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.style.setProperty("color-scheme", "light dark");
      setIsDarkMode(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      {children}
      <FloatButton
        type="primary"
        icon={isDarkMode ? <DarkModeIcon /> : <LightModeIcon />}
        onClick={() => {
          document.documentElement.style.setProperty(
            "color-scheme",
            isDarkMode ? "light" : "dark"
          );
          setIsDarkMode(!isDarkMode);
        }}
      />
    </ConfigProvider>
  );
};

export default Layout;

