import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./DashboardSidebar.scss";
import useCoachDetails from "../../hooks/useCoachDetails";
import { BarLoader } from "react-spinners";
import logo from "../../assets/logo/logo2.jpg";

const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate();

  // Retrieve the active item from localStorage, or default to "home"
  const initialActiveItem = localStorage.getItem("activeItem") || "home";
  const [activeItem, setActiveItem] = useState(initialActiveItem);

  const handleItemClick = (item: string) => {
    setActiveItem(item);
    // Store the active item in localStorage
    localStorage.setItem("activeItem", item);
  };

  const handleLogoClick = () => {
    handleItemClick("home"); // Set active item to home
  };

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const { coachDetails, loading, error } = useCoachDetails();

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">
        <Link to="/dashboard" className="logo-link" onClick={handleLogoClick}>
          <img src={logo} alt="PowerSync Logo" className="logo-image" />
          <h1>PowerSync</h1>
        </Link>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">
              <button
                className={activeItem === "home" ? "active" : ""}
                onClick={() => handleItemClick("home")}
              >
                <Icon icon="material-symbols:dashboard" />
                <h3>Dashboard</h3>
              </button>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/clients">
              <button
                className={activeItem === "client" ? "active" : ""}
                onClick={() => handleItemClick("client")}
              >
                <Icon icon="ic:baseline-people" />
                <h3>Clients</h3>
              </button>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/messages">
              <button
                className={activeItem === "messages" ? "active" : ""}
                onClick={() => handleItemClick("messages")}
              >
                <Icon icon="mdi:message" />
                <h3>Messages</h3>
              </button>
            </Link>
          </li>

          <li>
            <Link to="/dashboard/settings">
              <button
                className={activeItem === "settings" ? "active" : ""}
                onClick={() => handleItemClick("settings")}
              >
                <Icon icon="mdi:cog" />
                <h3>Settings</h3>
              </button>
            </Link>
          </li>

          <li>
            {loading ? (
              <BarLoader color="#ffffff" loading={true} width={300} />
            ) : error || !coachDetails ? (
              <div className="error-section">
                <div className="error-message">
                  <p>Failed to load Coach details.</p>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  <Icon icon="mdi:logout" />
                </button>
              </div>
            ) : (
              <div className="coach-section">
                <div className="coach-info">
                  <img
                    src={coachDetails.profilePicture}
                    alt={`${coachDetails.firstName} ${coachDetails.lastName}`}
                  />
                  <div className="coach-text-info">
                    <h4>
                      {coachDetails.firstName} {coachDetails.lastName}
                    </h4>
                    <p>{coachDetails.coachSpecialization}</p>
                    <p>{coachDetails.email}</p>
                  </div>
                </div>
                <button className="logout-button" onClick={handleLogout}>
                  <Icon icon="mdi:logout" />
                </button>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
