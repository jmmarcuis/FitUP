import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./DashboardSidebar.scss";
import logo from "../../assets/logo/logo2.jpg";

const DashboardSidebar: React.FC = () => {
  const navigate = useNavigate();

  // Retrieve the active item from localStorage or default to "home"
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
    localStorage.removeItem('token');
    navigate("/login"); 
  };

 
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
                className={activeItem === 'home' ? 'active' : ''}
                onClick={() => handleItemClick('home')}
              >
                <Icon icon="mdi:home" />
                <h3>Dashboard</h3>
              </button>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/workouts">
              <button
                className={activeItem === 'workouts' ? 'active' : ''}
                onClick={() => handleItemClick('workouts')}
              >
                <Icon icon="mdi:dumbbell" />
                <h3>Workouts</h3>
              </button>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/messages">
              <button
                className={activeItem === 'messages' ? 'active' : ''}
                onClick={() => handleItemClick('messages')}
              >
                <Icon icon="mdi:message" />
                <h3>Messages</h3>
              </button>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings">
              <button
                className={activeItem === 'settings' ? 'active' : ''}
                onClick={() => handleItemClick('settings')}
              >
                <Icon icon="mdi:cog" />
                <h3>Settings</h3>
              </button>
            </Link>
          </li>
          <li>
            <button onClick={handleLogout}>
              <Icon icon="mdi:logout" />
              <h3>Logout</h3>
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
