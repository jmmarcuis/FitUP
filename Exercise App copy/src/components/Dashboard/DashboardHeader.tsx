// DashboardHeader.tsx

import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import './DashboardHeader.scss';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="dashboard-header">
      <div className="logo">FitTrack</div>
      <nav>
        <ul>
          <li><a href="/dashboard">Home</a></li>
          <li><a href="/workouts">Workouts</a></li>
          <li><a href="/progress">Progress</a></li>
        </ul>
      </nav>
      <div className="user-menu">
        <span>{user?.userName}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

export default DashboardHeader;