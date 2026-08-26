import { useMemo, useState } from "react";
import {
  Menu,
  LogOut,
  LayoutDashboard,
  Moon,
  Sun,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

import Container from "../../common/Container/Container";
import Button from "../../common/Button/Button";
import Logo from "../../common/Logo/Logo";

type NavbarProps = {
  isAuthenticated?: boolean;
};

function Navbar({ isAuthenticated = false }: NavbarProps) {
  const navigate = useNavigate();

  const user = useMemo(() => {
    const data = localStorage.getItem("user");

    if (!data) {
      return null;
    }

    return JSON.parse(data);
  }, []);

  const initial = user?.name?.charAt(0).toUpperCase() ?? "";

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      return true;
    }

    return false;
  });

  const toggleDarkMode = () => {
    const html = document.documentElement;

    html.classList.toggle("dark");

    const isDark = html.classList.contains("dark");

    setDarkMode(isDark);

    localStorage.setItem(
      "theme",
      isDark ? "dark" : "light"
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur-md transition-colors duration-300"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <Container>
        <div className="flex h-20 items-center justify-between">
          {/* <Link to="/" className="flex items-center gap-2"> */}
            <Logo />
          {/* </Link> */}

          <nav className="hidden items-center gap-4 md:flex">
            {!isAuthenticated ? (
              <>
                <NavLink to="/">
                  {({ isActive }) => (
                    <Button variant={isActive ? "secondary" : "ghost"}>
                      Home
                    </Button>
                  )}
                </NavLink>

                <NavLink to="/login">
                  {({ isActive }) => (
                    <Button variant={isActive ? "secondary" : "ghost"}>
                      Login
                    </Button>
                  )}
                </NavLink>

                <NavLink to="/register">
                  <Button className="border-0 bg-linear-to-r from-[#0F766E] to-[#10B981] text-white shadow-md hover:opacity-95 cursor-pointer">
                    Get Started
                  </Button>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard">
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      leftIcon={<LayoutDashboard size={18} />}
                    >
                      Dashboard
                    </Button>
                  )}
                </NavLink>

                <NavLink to="/resume-analysis">
                  {({ isActive }) => (
                    <Button variant={isActive ? "secondary" : "ghost"}>
                      Resume Analysis
                    </Button>
                  )}
                </NavLink>

                <NavLink to="/interview">
                  {({ isActive }) => (
                    <Button variant={isActive ? "secondary" : "ghost"}>
                      Interview
                    </Button>
                  )}
                </NavLink>

                <NavLink to="/history">
                  {({ isActive }) => (
                    <Button variant={isActive ? "secondary" : "ghost"}>
                      History
                    </Button>
                  )}
                </NavLink>

                <div
                  className="ml-2 flex items-center gap-3 rounded-xl border px-3 py-2"
                  style={{
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-r from-[#0F766E] to-[#10B981] text-white text-lg font-bold">
                    {initial}
                  </div>

                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{
                        color: "var(--text)",
                      }}
                    >
                      {user?.name}
                    </p>

                    <p
                      className="text-xs"
                      style={{
                        color: "var(--text-light)",
                      }}
                    >
                      Logged In
                    </p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  leftIcon={<LogOut size={18} />}
                  onClick={handleLogout}
                  className="cursor-pointer"
                  style={{
                    borderColor: "#ef4444",
                    color: "#ef4444",
                  }}
                >
                  Logout
                </Button>
              </>
            )}

            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--text)",
                boxShadow: "0 2px 8px var(--shadow)",
              }}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border transition duration-300"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              type="button"
              className="cursor-pointer rounded-xl border p-2 transition"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Navbar;