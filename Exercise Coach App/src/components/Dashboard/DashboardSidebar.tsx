import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./DashboardSidebar.scss";
import useCoachDetails from "../../hooks/useCoachDetails";

const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState("home");
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    localStorage.removeItem("token");
    navigate("/login");
  };

  const { coachDetails, loading, error } = useCoachDetails();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!coachDetails) return null;

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">{/* Logo */}</div>
      <nav>
        <ul>
          <li>
            <div className="dashboard-link-flex">
              <Link to="/dashboard">
                <a
                  href="#home"
                  className={activeItem === "home" ? "active" : ""}
                  onClick={() => handleItemClick("home")}
                >
                  <Icon icon="mdi:home" />
                </a>
              </Link>
              <h3>Home</h3>
            </div>
          </li>
          <li>
            <div className="dashboard-link-flex">
              <Link to="/dashboard">
                <a
                  href="#client"
                  className={activeItem === "client" ? "active" : ""}
                  onClick={() => handleItemClick("client")}
                >
                  <Icon icon="ic:baseline-people" /> 
                </a>
              </Link>
              <h3>Clients</h3>
            </div>
          </li>
          <li>
            <div className="dashboard-link-flex">
              <Link to="/dashboard/workouts">
                <a
                  href="#workouts"
                  className={activeItem === "workouts" ? "active" : ""}
                  onClick={() => handleItemClick("workouts")}
                >
                  <Icon icon="mdi:dumbbell" />
                </a>
              </Link>
              <h3>Workout</h3>
            </div>
          </li>
          <li>
            <div className="dashboard-link-flex">
              <Link to="/dashboard/messages">
                <a
                  href="#messages"
                  className={activeItem === "messages" ? "active" : ""}
                  onClick={() => handleItemClick("messages")}
                >
                  <Icon icon="mdi:message" />
                </a>
              </Link>
              <h3>Messages</h3>
            </div>
          </li>

          <li>
            <div className="dashboard-link-flex">
              <Link to="/dashboard/settings">
                <a
                  href="#settings"
                  className={activeItem === "settings" ? "active" : ""}
                  onClick={() => handleItemClick("settings")}
                >
                  <Icon icon="mdi:cog" />
                </a>
              </Link>
              <h3>Settings</h3>
            </div>
          </li>

          <li>
            <div className="dashboard-link-flex">
              <div className="coach-info-flex">
                <img
                  src={coachDetails.profilePicture}
                  alt={`${coachDetails.firstName} ${coachDetails.lastName}`}
                />
                <div className="coach-info">
                  <h4>
                    {coachDetails.firstName} {coachDetails.lastName}
                  </h4>
                  <p>{coachDetails.coachSpecialization}</p>
                  <p>{coachDetails.email}</p>
                </div>
              </div>
              <button onClick={handleLogout}>
                <Icon icon="mdi:logout" />
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
