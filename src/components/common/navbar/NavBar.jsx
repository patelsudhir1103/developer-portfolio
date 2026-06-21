import { useEffect, useState } from "react";
import logo from "../../../assets/logo.png";
import { Link as ScrollLink } from "react-scroll";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon, faUserLock, faSignOutAlt, faHome } from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { id: 1, name: "Home", url: "introduction" },
  { id: 2, name: "About", url: "profile" },
  { id: 3, name: "Process", url: "work-process" },
  { id: 4, name: "Portfolio", url: "portfolio" },
  { id: 5, name: "Blog", url: "blog" },
  { id: 6, name: "Services", url: "services" },
];

const NavBar = () => {
  const [position, setPosition] = useState(0);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setPosition(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);

    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkLogin);
    // Custom login event helper
    window.addEventListener("admin-login-changed", checkLogin);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("admin-login-changed", checkLogin);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("theme-changed"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("adminUser");
    setIsLoggedIn(false);
    navigate("/");
    window.dispatchEvent(new Event("admin-login-changed"));
  };

  const handleMenuClick = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  const menu = navItems.map((item) => (
    <li key={item.id} onMouseDown={(e) => e.preventDefault()}>
      {isHomePage ? (
        <ScrollLink
          onClick={handleMenuClick}
          to={item.url.toLowerCase()}
          smooth={true}
          duration={1000}
          spy={true}
          offset={-140}
          activeStyle={{
            backgroundColor: "#9929fb",
            color: "white",
          }}
          className="hover:text-picto-primary px-5 py-3 mx-1 cursor-pointer dark:text-gray-300 dark:hover:text-white"
        >
          {item.name}
        </ScrollLink>
      ) : (
        <RouterLink
          to={`/#${item.url.toLowerCase()}`}
          onClick={handleMenuClick}
          className="hover:text-picto-primary px-5 py-3 mx-1 dark:text-gray-300 dark:hover:text-white"
        >
          {item.name}
        </RouterLink>
      )}
    </li>
  ));

  return (
    <div
      className={`sticky top-0 ${
        position > 50
          ? "bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-md"
          : "bg-white dark:bg-gray-900 border-white dark:border-gray-900"
      } z-50 transition-all duration-300`}
    >
      <div className="navbar flex justify-between mx-auto content py-3">
        <div className="flex items-center justify-between">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden dark:text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-lg dropdown-content rounded-box z-1 mt-3 w-lvw p-2 shadow font-semibold flex-nowrap bg-white dark:bg-gray-800 text-black dark:text-white border border-gray-150 dark:border-gray-700"
            >
              {menu}
            </ul>
          </div>

          <RouterLink
            to="/"
            className="flex items-center border-0 lg:max-xxl:ps-5"
          >
            <img src={logo} className="h-8 sm:h-14 rounded-2xl" alt="logo" />
            <p className="text-2xl sm:text-[32px] my-auto ms-[12px] font-semibold text-black dark:text-white">
              Patel Sudhir
            </p>
          </RouterLink>
        </div>

        <div className="lg:flex items-center gap-3">
          <ul className="hidden lg:flex menu menu-horizontal text-[16px] font-medium md:shrink-0 text-black dark:text-white">
            {menu}
          </ul>
          
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-circle text-gray-700 dark:text-yellow-400 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              <FontAwesomeIcon icon={theme === "light" ? faMoon : faSun} className="text-lg" />
            </button>

            {/* Admin Dashboard / Logout Buttons */}
            {isLoggedIn ? (
              location.pathname === "/admin" ? (
                <>
                  <RouterLink
                    to="/"
                    className="btn btn-sm btn-ghost gap-2 dark:text-white"
                  >
                    <FontAwesomeIcon icon={faHome} />
                    Home
                  </RouterLink>
                  <button
                    onClick={handleLogout}
                    className="btn btn-sm btn-error text-white gap-2 cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                  </button>
                </>
              ) : (
                <RouterLink
                  to="/admin"
                  className="btn btn-sm btn-secondary text-white gap-2"
                >
                  <FontAwesomeIcon icon={faUserLock} />
                  Dashboard
                </RouterLink>
              )
            ) : (
              !["/admin", "/login"].includes(location.pathname) && (
                <RouterLink
                  to="/login"
                  className="btn btn-sm btn-ghost gap-1.5 text-gray-500 dark:text-gray-400 hover:text-picto-primary"
                  title="Admin Login"
                >
                  <FontAwesomeIcon icon={faUserLock} />
                </RouterLink>
              )
            )}

            {isHomePage && (
              <ScrollLink
                className="btn btn-sm xs:btn-md btn-primary text-white"
                to="contact"
                smooth={true}
                duration={900}
              >
                Contact
              </ScrollLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
