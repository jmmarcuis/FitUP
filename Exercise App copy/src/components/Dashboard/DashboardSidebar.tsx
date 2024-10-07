import React, { useState } from 'react';
import { useAuth } from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import "./DashboardSidebar.scss";

const DashboardSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [activeItem, setActiveItem] = useState('home');
  const handleItemClick = (item: string) => {
    setActiveItem(item);
  };

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
                className={activeItem === 'home' ? 'active' : ''} 
                onClick={() => handleItemClick('home')}
              >
              <Icon icon="mdi:home" />
              </a>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/workouts">
             <a 
                href="#workouts" 
                className={activeItem === 'workouts' ? 'active' : ''} 
                onClick={() => handleItemClick('workouts')}
              >
                <Icon icon="mdi:dumbbell" />
              </a>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/messages">
              <a 
                href="#messages" 
                className={activeItem === 'messages' ? 'active' : ''} 
                onClick={() => handleItemClick('messages')}
              >
              <Icon icon="mdi:message" />
              </a>
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings">
              <a 
                href="#settings" 
                className={activeItem === 'settings' ? 'active' : ''} 
                onClick={() => handleItemClick('settings')}
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
