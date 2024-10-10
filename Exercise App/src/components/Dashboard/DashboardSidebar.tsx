import React, { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./DashboardSidebar.scss";

const DashboardSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get the current location

  const [activeItem, setActiveItem] = useState<string>("");

  useEffect(() => {
    // Set active item based on the current path
    if (location.pathname.startsWith("/dashboard/workouts")) {
      setActiveItem("workouts");
    } else if (location.pathname.startsWith("/dashboard/messages")) {
      setActiveItem("messages");
    } else if (location.pathname.startsWith("/dashboard/settings")) {
      setActiveItem("settings");
    } else {
      setActiveItem("home");
    }
  }, [location.pathname]); // Dependency array ensures it runs when location changes

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    logout();
    navigate("/login"); // Redirect to the login page after logout
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">{/* Logo */}</div>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">
              <a
                href="#home"
                className={activeItem === "home" ? "active" : ""}
              >
                <Icon icon="mdi:home" />
              </a>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/workouts">
              <a
                href="#workouts"
                className={activeItem === "workouts" ? "active" : ""}
              >
                <Icon icon="mdi:dumbbell" />
              </a>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/messages">
              <a
                href="#messages"
                className={activeItem === "messages" ? "active" : ""}
              >
                <Icon icon="mdi:message" />
              </a>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings">
              <a
                href="#settings"
                className={activeItem === "settings" ? "active" : ""}
              >
                <Icon icon="mdi:cog" />
              </a>
            </Link>
          </li>

          <li>
            <button onClick={handleLogout}>
              <Icon icon="mdi:logout" />
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;