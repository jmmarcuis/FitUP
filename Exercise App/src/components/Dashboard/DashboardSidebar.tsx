import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import {Link , useNavigate } from "react-router-dom";
import { Icon } from '@iconify/react';
import './DashboardSidebar.scss';

const DashboardSidebar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    logout();
    navigate('/login'); // Redirect to the login page after logout
  }

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">
        {/* Logo */}
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard">
              <Icon icon="mdi:view-dashboard" />  
            </Link>
          </li>
          <li>
            <Link to="/dashboard/workouts">
              <Icon icon="mdi:dumbbell" />
            </Link>
          </li>
          <li>
            <Link to="/dashboard/progress">
              <Icon icon="mdi:chart-line" />  
            </Link>
          </li>
          <li>
            <Link to="/dashboard/nutrition">
              <Icon icon="mdi:food-apple" />  
            </Link>
          </li>
          <li>
            <Link to="/dashboard/messages">
              <Icon icon="mdi:message" />  
            </Link>
          </li>
          <li>
            <Link to="/dashboard/settings">
              <Icon icon="mdi:cog" />  
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