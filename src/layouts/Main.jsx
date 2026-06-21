import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/common/navbar/NavBar";
import Footer from "../components/common/footer/Footer";
import ScrollToTop from "../components/common/scrollToTop/ScrollToTop";
import Chatbot from "../components/chatbot/Chatbot";

const Main = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    // Apply theme
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    const handleThemeChange = () => {
      const activeTheme = localStorage.getItem("theme") || "light";
      setTheme(activeTheme);
    };

    window.addEventListener("theme-changed", handleThemeChange);
    return () => window.removeEventListener("theme-changed", handleThemeChange);
  }, [theme]);

  return (
    <div data-theme={theme} className="relative min-h-screen transition-colors duration-300 dark:bg-gray-900 dark:text-white bg-white text-black">
      <NavBar />
      <Outlet />
      <div className="bg-[#2A374A] dark:bg-gray-950">
        <Footer />
      </div>
      <ScrollToTop />
      <Chatbot />
    </div>
  );
};

export default Main;
